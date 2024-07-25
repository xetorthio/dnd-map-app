# dnd-map-app

## Description

The `dnd-map-app` is a web-based tool designed for tabletop roleplaying games like Dungeons & Dragons. It transforms your TV into a dynamic battle map, enhancing your gaming experience. The Dungeon Master (DM) connects their computer to a TV via HDMI (or a similar method), and opens a browser window on the TV in player mode and another on the DM's computer in DM mode. This setup allows the DM to control the map, manage fog of war, reveal sections, move around the map, zoom in and out, and add various effects to represent spells and area effects.

## Features

- **Dynamic Fog of War:** Reveal hidden areas as players explore.
- **Interactive Map Control:** Move, zoom, and adjust the map in real-time.
- **Area Effects:** Add visual representations of spells and other effects.
- **Web-based Interface:** Access the battle map from any modern browser.

## Technologies

- **React:** For building the user interface.
- **Konva.js:** For 2D canvas animations and rendering.
- **Websockets:** For real-time communication between the DM and player interfaces.

## Getting Started

### Prerequisites

- **Node.js:** Ensure you have Node.js installed on your system.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/xetorthio/dnd-map-app.git
   cd dnd-map-app
   ```

2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```

### Running the Server

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Start the WebSocket server:
   ```bash
   node server.js
   ```

   The server runs on port `3001` by default.

### Running the React Application

1. Navigate back to the root directory:
   ```bash
   cd ..
   ```

2. Start the React application:
   ```bash
   npm start
   ```

   The React app listens on port `3000`. Open `localhost:3000` in your browser to access the application.

## Collaboration

We welcome contributions from the community! To get started:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear, concise messages.
4. Push your branch to your forked repository.
5. Open a pull request with a detailed description of your changes.

## TODO List

1. ~**Open source it:** Finalize licensing and documentation for open-source release.~
2. **Add save and load option:** Enable saving and loading of maps and states.
3. **Add different types of area effects:** Implement effects like circles, cones, etc.
4. **Add animations to effects:** Include animations for effects like fire and thunder.
5. **Add library of images:** Allow images to be placed contextually on the map.
6. ~**Hide player top bar by default:** Only show it when there is a connection problem.~
7. **Add DM map:** Provide a separate map for the DM with additional information.
8. ~**Enable effects and reveals in any direction:** Currently, they can only be done towards the bottom right.~
9. **Fix z-index issues:** Address layering problems with reveals and effects.
10. **Reposition player view:** Center the view on the cursor for easier interaction.
11. **Configure ports and server URL:** Allow customization of connection settings.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or issues, please open an issue on GitHub or contact the project maintainers at [ionathan@gmail.com].

---

Thank you for using `dnd-map-app`! We hope it enhances your tabletop gaming experience. Happy adventuring!
