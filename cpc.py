import subprocess
import collections
import os
import argparse

# Define base values
base_value_per_line = 1
half_value_per_line = base_value_per_line / 2

# Define multipliers for specific files or directories
value_multipliers = {
    'critical_file.py': 2,
    'important_module/': 1.5,
}

# Extensions considered as text files
text_file_extensions = ['.txt', '.md']

def is_text_file(file_path):
    """Check if a file is a text file based on its extension."""
    return any(file_path.endswith(ext) for ext in text_file_extensions)

def get_value_multiplier(file_path):
    """Get the value multiplier for a given file based on its path."""
    for path, multiplier in value_multipliers.items():
        if file_path.startswith(path):
            return multiplier
    return 1  # Default multiplier if no specific rule applies

def get_git_files():
    """Get a list of all files tracked by Git."""
    files = subprocess.check_output(['git', 'ls-tree', '-r', 'HEAD', '--name-only']).decode('utf-8')
    return files.strip().split('\n')

def count_lines_and_points_by_author(file_list):
    """Count lines of code and points by author for each file, applying different values for text files and comments."""
    author_stats = collections.defaultdict(lambda: {'lines': 0, 'points': 0})
    for file in file_list:
        is_text = is_text_file(file)
        value_multiplier = get_value_multiplier(file)
        try:
            blame_output = subprocess.check_output(['git', 'blame', '--line-porcelain', file]).decode('utf-8', errors='ignore')
            for line in blame_output.split('\n'):
                if line.startswith('author '):
                    author = line[len('author '):]
                    author_stats[author]['lines'] += 1
                    # Apply half value for text files or commented lines
                    if is_text or line.strip().startswith('#'):
                        author_stats[author]['points'] += half_value_per_line * value_multiplier
                    else:
                        author_stats[author]['points'] += base_value_per_line * value_multiplier
        except subprocess.CalledProcessError:
            print(f"Skipping file due to error: {file}")
    return author_stats

def read_dao_contributors(file_path='daoContributors.txt'):
    """Read the daoContributors.txt file and return a mapping of author names to blockchain addresses."""
    if not os.path.exists(file_path):
        return None

    contributors = {}
    with open(file_path, 'r') as file:
        for line in file:
            parts = line.strip().split(maxsplit=1)
            if len(parts) == 2:
                contributors[parts[0]] = parts[1]  # Use full names as provided
    return contributors

def print_contributors_table(contributors, author_stats, total_points):
    """Print the table of contributors with blockchain addresses and '% of Claimed Points', for those listed in the daoContributors file."""
    # Calculate total points for contributors in the daoContributors file
    total_contributor_points = sum(author_stats[author]['points'] for author in contributors if author in author_stats)

    print(f"\n{'Author':<25} {'Address':<42} {'% of Total Points':<18} {'% of Claimed Points':<18}")
    print('-' * 115)
    for author, address in contributors.items():
        if author in author_stats:
            stats = author_stats[author]
            percentage_of_total = (stats['points'] / total_points) * 100 if total_points > 0 else 0
            percentage_of_claimed = (stats['points'] / total_contributor_points) * 100 if total_contributor_points > 0 else 0
            print(f"{author:<25} {address:<42} {percentage_of_total:<18.2f} {percentage_of_claimed:<18.2f}")



def main(repo_path):
    os.chdir(repo_path)
    files = get_git_files()
    author_stats = count_lines_and_points_by_author(files)

    # Calculate the total points contributed by all authors
    total_points = sum(stats['points'] for stats in author_stats.values())

    # Print the original table
    print(f"{'Author':<25} {'Lines':<10} {'Points':<10} {'% of Total Points':<18}")
    print('-' * 65)
    for author, stats in author_stats.items():
        percentage_of_total = (stats['points'] / total_points) * 100 if total_points > 0 else 0
        print(f"{author:<25} {stats['lines']:<10} {stats['points']:<10.2f} {percentage_of_total:<18.2f}")

    # Attempt to read the daoContributors file and print the corresponding table or error message
    contributors = read_dao_contributors()
    if contributors is not None:
        print_contributors_table(contributors, author_stats, total_points)
    else:
        print("\ndaoContributors file not found. Please add one.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Analyze Git repository contributions with valuation, including text files and comments, and map to blockchain addresses.')
    parser.add_argument('repo_path', type=str, help='Path to the Git repository')
    args = parser.parse_args()

    repo_path = os.path.expanduser(args.repo_path)
    main(repo_path)
