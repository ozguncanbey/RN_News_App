# React Native News App

## Overview

React Native News App is a lightweight yet powerful news reader application developed using Expo and React Native. It fetches real-time headlines from the NewsAPI, allowing users to stay updated with the latest news from around the world. Built as part of my journey into the React Native ecosystem, this app demonstrates fundamental mobile development concepts including state management, networking, navigation, and responsive UI design.

## Features

* **Country-based Headlines**: Browse top headlines by selecting from a list of countries
* **Search & Sort**: Search for articles by keyword and sort results by popularity or publish date
* **Infinite Scroll & Pull-to-Refresh**: Seamless pagination and content refreshing
* **Article Details**: View full article content with "Read More" links, share functionality, and bookmarking
* **Bookmark Management**: Save and manage favorite articles with persistent local storage
* **Empty & Loading States**: Custom views for loading indicators and empty results
* **Responsive Design**: Adaptive UI that adjusts to different screen sizes and orientations

## Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Home Page</strong></td>
      <td align="center"><strong>Search Results</strong></td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/b130bd5d-563d-4ab0-954a-b0e667b7bfb2" width="250"/></td>
      <td><img src="https://github.com/user-attachments/assets/f88b1fa3-1e8f-4368-bee8-a95ef25094fe" width="250"/></td>
    </tr>
    <tr>
      <td align="center"><strong>Article Detail</strong></td>
      <td align="center"><strong>Bookmark Page</strong></td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/242bf1a4-949f-4e78-8437-9aa7fcd2cbb5" width="250"/></td>
      <td><img src="https://github.com/user-attachments/assets/69407017-68df-4d3a-89eb-d3966cef68ca" width="250"/></td>
    </tr>
    <tr>
      <td align="center"><strong>Bookmark Delete</strong></td>
    </tr>
    <tr>
      <td><img src="https://github.com/user-attachments/assets/c2e2813c-5006-47db-8202-02544fe0aec8" width="250"/></td>
    </tr>
  </table>
</div>

## Technologies & Packages

* **React Native & Expo**: Core framework and development platform
* **Expo Router**: File-based routing and navigation management
* **@react-navigation/native**: Core library for navigation
* **@react-native-async-storage/async-storage**: Persistent storage for bookmarks
* **expo-constants**: Access to Expo environment variables
* **@expo/vector-icons/MaterialIcons**: Icon library
* **URLSearchParams**: Managing URL parameters for API requests
* **fetch API**: Network requests
* **React Hooks**: State management and side effects

## Architecture

The app follows a modular architecture with:

- **Screens**: Main UI components for different app sections
- **Components**: Reusable UI elements
- **Hooks**: Custom hooks for data fetching and state management
- **Utils**: Helper functions and constants
- **Services**: API communication logic
- **Storage**: Local data persistence


## Requirements

- Node.js 14.0 or later
- Expo CLI
- iOS Simulator or Android Emulator for local development
- NewsAPI API key

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ozguncanbey/RN-News-App.git
   cd RN-News-App
   ```

2. **Configure API Key**
   - Create a file named `secrets.ts` in the `constants` folder
   - Add the following code:
     ```typescript
     export const API_KEY = 'YOUR_NEWS_API_KEY';
     ```
   - Make sure `secrets.ts` is added to your `.gitignore` file

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Run the app**
   ```bash
   npx expo start
   ```
   
   Then select your simulator (`i` for iOS, `a` for Android) from the terminal options.

## Troubleshooting

- **API Key Issues**: Ensure your NewsAPI key is correctly configured in `secrets.ts`
- **Module Resolution Errors**: Try clearing the Metro bundler cache with `npx expo start -c`
- **Expo Go Compatibility**: Make sure you're using a compatible version of Expo Go with your Expo SDK version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
