import pandas as pd
from rapidfuzz import process, fuzz

# Cache dataset and mapping to avoid repeated loading
_df_cache = None
_class_map_cache = None

def lookup_disease_info(class_name: str):
    global _df_cache, _class_map_cache

    # Load and cache the CSV only once
    if _df_cache is None:
        _df_cache = pd.read_csv("backend\plant_diseases.csv")
    
    # Build CSV keys once
    if _class_map_cache is None:
        csv_keys = [f"{row['Plant']} - {row['Disease']}" for _, row in _df_cache.iterrows()]
        _class_map_cache = {"csv_keys": csv_keys}

    # Normalize model class name
    def normalize_class(cls):
        cls = cls.replace("___", " - ").replace("__", " - ").replace("_", " ")
        return cls.strip()

    norm = normalize_class(class_name)
    match, score, _ = process.extractOne(norm, _class_map_cache["csv_keys"], scorer=fuzz.token_sort_ratio)

    if score >= 75:
        row_index = _class_map_cache["csv_keys"].index(match)
        row = _df_cache.iloc[row_index]
        return row.to_dict()
    else:
        return None

if __name__ == "__main__":
    print(lookup_disease_info("Tomato___Tomato_mosaic_virus"))