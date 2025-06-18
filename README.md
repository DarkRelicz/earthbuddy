# EarthBuddy

The **EarthBuddy Chrome** Extension helps users make informed, sustainable choices by providing Environmental, Social, and Governance (ESG) risk ratings for brands.

<img width="372" alt="image" src="https://github.com/user-attachments/assets/f2c8a20d-8ef6-40e1-9e94-05a8a93e9495" />

## Key Features

- Displays the ESG risk rating of the brand.
- Suggests alternative brands with better ESG ratings.
- Encourages users to choose environmentally and socially responsible options.
- User-Friendly: User-Centered Design

## Installation

There are two ways to prepare the web extension
1. Using our prepacked `earthbuddy-extension.zip` folder or
2. Building it yourself
    
1. To use the prepacked folder
    1. `git clone https://github.com/DarkRelicz/earthbuddy.git`
    2. Unzip `earthbuddy-extension.zip`
    3. You should see a `earthbuddy-extension` folder within  

2. To build the web extension 
    1. `git clone https://github.com/DarkRelicz/earthbuddy.git`
    2. `cd` to `/extension`
    3. Run `npm install` to install node_modules folder
    4. Run`npm run build` to build the extension
    5. At this point, you should see `/dist` folder been updated


## Usage

To load web extension
1. Under browser settings look for `manage extensions` (for chromium browsers)
2. Enable `developer mode`, should be top right corner
3. Click `load unpacked`
    - If you are using the zip version, select the `earthbuddy-extension` folder 
    - If you are using the built version, navigate into `/extension` and select the `dist` folder 

## Tech Stack

| Frontend               | Backend           | APIs & Services        |
|------------------------|--------------------|-------------------------|
| React + TypeScript     | Flask (Python)     | Google Gemini API       |
| TailwindCSS            | Render (hosted)    | yFinance (ESG Scores)   |
| Chrome Extension APIs  |                    | Brandfetch (logos)      |

---

### Folder Structure

```text
.
├── extension/                   # Frontend (Chrome extension)
│   ├── assets/                  # Static assets (icons, images)
│   ├── components/              # Reusable UI components
│   ├── atoms/                   # Utility functions (e.g., Rating, Functions)
│   ├── popup.tsx                # Main popup component
│   ├── App.tsx                  # Extension wrapper logic
│   ├── index.html               # HTML entry point
│   └── manifest.json            # Chrome extension configuration
│
├── ticker_to_esg/               # Backend (Flask + Gemini + ESG)
│   ├── main.py                  # Main Flask server
│   └── utils/                   # Utility modules
│       ├── getLogo.py           # Fetch brand logos using Brandfetch
│       └── yfinance.py          # Fetch ESG scores via yfinance
│
├── .env.example                 # Environment variable template
├── requirements.txt             # Python backend dependencies
├── README.md                    # Project documentation
└── LICENSE                      # (Optional) Project license
```

### Example ESG API Call

```http
GET /get_ticker?brand_name=Nike&esg_score=18.6
```
### Successful Response from Server
```
{
  "brand_name": "Nike",
  "alternatives": [
    {
      "brand_name": "Adidas",
      "ticker": "ADDYY",
      "esg_score": 15.2,
      "homepage": "https://www.adidas.com",
      "image_url": "https://cdn.brandfetch.io/adidas.com/logo"
    }]
}
```

## Privacy and Data Usage

EarthBuddy does not collect or store any personal data. All ESG ratings and brand comparisons are processed locally within your browser to ensure user privacy.

## Challenges & Learning Points

- Tickers would not always be accurate due to similar company names
- Data Gaps in free ESG sources required fallback logic

## Future Plans

- Add support for more browsers (e.g., Firefox, Safari).
- Allow users to contribute brand feedback and sustainability reviews.
- Caching to improve speed of which ESG score are being extracted

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add feature-name"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, please contact [DarkRelicz@gmail.com].
