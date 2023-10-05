import sys
import unicodedata
import re
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from unidecode import unidecode
from googletrans import Translator

def clean_summary(text):
    text = unicodedata.normalize("NFKD", text)  # Normalize Unicode characters
    text = unidecode(text)  # Transliterate Unicode characters
    text = re.sub(r'[^\w\s.,]', ' ', text)  # Replace non-alphanumeric characters with spaces
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = text.strip()  # Remove leading/trailing spaces
    return text

def translate_summary(text, target_language='en'):
    translator = Translator()
    translation = translator.translate(text, dest=target_language)
    return translation.text

def main():
    if len(sys.argv) != 2:
        print("Usage: python summarizer.py input.txt")
        return

    input_filename = sys.argv[1]

    with open(input_filename, 'r', encoding='utf-8') as input_file:
        input_text = input_file.read()

    parser = PlaintextParser.from_string(input_text, Tokenizer("english"))
    summarizer = LexRankSummarizer()
    summary = summarizer(parser.document, sentences_count=20)

    cleaned_summary = clean_summary(" ".join(str(sentence) for sentence in summary))

    target_language = 'en'  # Change this to the user-selected language

    # Ensure that the user-selected language is valid
    valid_languages = ['en', 'hi', 'es', 'de']  # Add more languages as needed
    if target_language not in valid_languages:
        print("Invalid target language selected.")
        return

    translated_summary = translate_summary(cleaned_summary, target_language)

    output_filename = 'summary.txt'
    with open(output_filename, 'w', encoding='utf-8') as output_file:
        output_file.write(translated_summary)

if __name__ == "__main__":
    main()
