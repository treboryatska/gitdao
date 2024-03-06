#!/bin/bash

# File name
FILE="daoContributors.txt"
# Temporary file to accumulate added lines
TEMP_FILE="temp_added_lines.txt"

# Ensure the temporary file is empty
> "$TEMP_FILE"

# Process each commit that modified the specified file
git log --reverse --patch -- "$FILE" | \
while IFS= read -r line; do
    # Check if the line starts with a '+' and is not part of the diff headers
    if [[ $line == +[^+]* ]]; then
        # Remove the leading '+' and add the line to the temp file if it's not a duplicate
        echo "${line:1}" >> "$TEMP_FILE"
    fi
done

# Sort the temp file and remove duplicates to create the final file
sort -u "$TEMP_FILE" > "complete_history_$FILE"

# Remove the temporary file
rm "$TEMP_FILE"

echo "Complete history of added lines (including deleted ones) is stored in 'complete_history_$FILE'"
