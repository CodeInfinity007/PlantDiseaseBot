import re

def clean_response(text):
    """Remove Markdown formatting (*, _, -) and extra spaces."""
    text = re.sub(r"[*_`]", "", text)  # Remove *, _, ` symbols
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces
    text = text.replace("\n", " ")  # Replace new lines with spaces for better display
    return text


text = """
Lorem Ipsum Dolor
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut Enim ad Minim

Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.

Excepteur sint occaecat cupidatat non proident.

Sunt in Culpa

Qui officia deserunt mollit anim id est laborum.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur.

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit.

Conclusion
Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.
Nullam varius, turpis et commodo pharetra, est eros bibendum elit.
"""

print(text)
clean_response(text)
print(text)
