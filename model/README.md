# Model Training & Data Processing 📊

This directory contains the complete machine learning pipeline for PropertyIQ, including data preprocessing, feature engineering, model training, and evaluation using Winnipeg real estate data.

## 🎯 Overview

The ML pipeline processes two main data sources:
1. **House/Condo Sales Data** (2016-2021) - Extracted from City of Winnipeg PDF sales books
2. **Tax Assessment Data** - Property characteristics and features

The pipeline transforms raw data into a trained scikit-learn model capable of predicting house prices based on property features.

## 📁 Directory Structure

```
model/
├── datasets/
│   ├── input/           # Raw data files
│   │   ├── house_condo/ # Sales data (CSV converted from PDF)
│   │   └── tax-assessment-details.csv (download required)
│   └── output/          # Processed datasets
├── notebooks/           # Jupyter notebooks for ML pipeline
│   ├── joblib/         # Serialized models and transformers
│   └── *.ipynb         # Processing and training notebooks
└── README.md           # This file
```

## 🚀 Setup & Installation

### 1. Download Required Dataset
Due to file size limitations, manually download the Tax Assessment dataset:

1. Visit [Winnipeg Tax Assessment Dataset](https://data.winnipeg.ca/Assessment-Taxation-Corporate/Assessment-Parcels/d4mq-wa44)
2. Download as CSV format
3. Save as `model/datasets/input/tax-assessment-details.csv`

### 2. Verify Sales Data Files
Ensure you have **22 CSV files total** (11 files per time period):

```
model/datasets/input/house_condo/csv-version/
├── 2016-2018/  # 11 CSV files
└── 2019-2021/  # 11 CSV files
```

> **Note**: These files were converted from PDF to CSV using [Tabula](https://tabula.technology/)

### 3. Install Dependencies
```bash
cd model/notebooks/
py -m pip install pandas numpy python-dotenv gql joblib scikit-learn matplotlib seaborn jupyter
```

## 🔄 Execution Workflow

Run the notebooks in the following sequence:

### 1. `combine_csv.ipynb`
- **Purpose**: Combines multiple regional sales CSV files into unified datasets
- **Input**: 22 individual CSV files from sales books
- **Output**: `house_sale_with_tax.csv`, `condo_sale_with_tax.csv`

### 2. `fetch_data_postgres.ipynb` 
- **Purpose**: Retrieves processed data from PostgreSQL database via GraphQL
- **Input**: Database connection (configured via environment variables)
- **Output**: `fetch_postgres.csv`

### 3. `train_model.ipynb`
- **Purpose**: Feature engineering, model training, and evaluation
- **Input**: Combined and processed datasets
- **Output**: Trained model artifacts in `joblib/` directory

> **Note**: `build_csv_postgres.ipynb` was used for initial database upload and doesn't need to be re-executed.

## ✅ Expected Outputs

After successful execution, verify these files exist:

### Model Artifacts (`model/notebooks/joblib/`)
- `model.joblib` - Trained regression model
- `num.joblib` - Numerical feature scaler
- `ohe.joblib` - One-hot encoder for categorical features

### Processed Datasets (`model/datasets/output/`)
- `condo_sale_with_tax.csv` - Condo sales with tax assessment features
- `house_sale_with_tax.csv` - House sales with tax assessment features  
- `fetch_postgres.csv` - Data retrieved from PostgreSQL

## 🔧 Technical Details

### Machine Learning Pipeline
1. **Data Cleaning**: Handle missing values, outliers, and data type conversions
2. **Feature Engineering**: Create derived features from raw property data
3. **Preprocessing**: Scale numerical features, encode categorical variables
4. **Model Training**: Train regression model using scikit-learn
5. **Evaluation**: Assess model performance with validation metrics

### Key Features Used
- Living area (sq ft)
- Land area (sq ft)
- Number of rooms/bedrooms/bathrooms
- Property age and condition
- Basement/garage/pool presence
- Neighborhood characteristics

## 🗃️ Additional Data Sources

The City of Winnipeg provides numerous datasets that could enhance the model:

### Core Real Estate Data
- [Property Sale Data](https://assessment.winnipeg.ca/AsmtTax/English/SelfService/SalesBooks.stm) - Biennial sales books
- [Tax Assessment Details](https://data.winnipeg.ca/Assessment-Taxation-Corporate/Assessment-Parcels/d4mq-wa44) - Property characteristics
- [Property Development Sales](https://www.winnipeg.ca/ppd/Documents/CityProperty/ForSale/HistoricalSales.stm) - Historical sales data

### Demographic & Geographic Data
- [Census Mobility](https://data.winnipeg.ca/Census/Census-Mobility/v6j5-ju9t) - Neighborhood mobility patterns
- [Education Statistics](https://data.winnipeg.ca/Census/Census-2006-Education/8xwc-nv6i) - Education levels by area
- [Income Characteristics](https://data.winnipeg.ca/Census/Census-2006-Income/x4f4-489t) - Income distribution by area
- [Household Characteristics](https://data.winnipeg.ca/Census/Census-Households/nmk5-uwfw) - Household composition data

### Infrastructure & Amenities
- [Parks and Open Space](https://data.winnipeg.ca/Parks/Parks-and-Open-Space/tx3d-pfxq) - Green space proximity
- [Building Permits](https://data.winnipeg.ca/Development-Approvals-Building-Permits-Inspections/Aggregate-Building-Permit-Data/p5sy-gt7y/data) - Development activity
- [All Winnipeg Datasets](https://data.winnipeg.ca/browse?limitTo=datasets,maps&sortBy=newest) - Complete dataset catalog

## 🛠️ Troubleshooting

### Common Issues
- **Missing CSV files**: Ensure all 22 sales CSV files are present
- **Database connection errors**: Check PostgreSQL credentials and network connectivity
- **Memory issues**: Large datasets may require increased RAM or data sampling
- **Dependency conflicts**: Use virtual environment for Python package isolation

### Performance Tips
- Use data sampling for initial development and testing
- Monitor memory usage during large dataset processing
- Consider using chunked processing for very large files

---

**Next Steps**: After successful model training, the generated joblib files will be used by the Flask API server for real-time predictions.