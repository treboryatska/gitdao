#!/bin/bash

# CFR - Configurable File Reader

# File name
FILE="daoContributors.txt"
# Temporary file to accumulate added lines
TEMP_FILE="temp_added_lines.txt"
# Author of interest
AUTHOR_EMAIL="author@example.com"

# Ensure the temporary file is empty
> "$TEMP_FILE"

# Process each commit that modified the specified file
git log --reverse --patch --pretty=format:'%H %an <%ae>' -- "$FILE" | \
while IFS= read -r line; do
    # Capture commit hash and author email
    if [[ $line =~ ^[0-9a-f]{40} ]]; then
        CURRENT_COMMIT_AUTHOR=${line##*<}
        CURRENT_COMMIT_AUTHOR=${CURRENT_COMMIT_AUTHOR%>*}
    # Check if the line starts with a '+' and is not part of the diff headers
    elif [[ $line == +[^+]* ]] && [[ $CURRENT_COMMIT_AUTHOR == "$AUTHOR_EMAIL" ]]; then
        # Remove the leading '+' and add the line to the temp file if it's not a duplicate
        # Attribution to author is based on the commit
        echo "${line:1}" >> "$TEMP_FILE"
    fi
done

# Sort the temp file and remove duplicates to create the final file
sort -u "$TEMP_FILE" > "complete_history_$FILE"

# Remove the temporary file
rm "$TEMP_FILE"

echo "Complete history of added lines by $AUTHOR_EMAIL is stored in 'complete_history_$FILE'"
