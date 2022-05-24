# Hotel Management Front-End

## Installation

1. Clone the repository either using the GitHub UI or by running the command:

```console
git clone https://github.com/alxael/hmfe.git
``` 

2. Install the project dependencies by running the command: 

```console
npm install
```

3. Add to the root file the following ```.env``` file:

```text
PORT = 8080
NODE_ENV = development
REACT_APP_API_URL = 'https://localhost:44304/api/'
HTTPS = true
```

## Running

Enter the following command to run the project:

```console
npm run start
```

In order to run the project in a proper development environment please make sure to turn on the feature that allows invalid certificates for resources loaded from ```localhost```. For Chrome and Edge simply paste the appropriate link:

```
chrome://flags/#allow-insecure-localhost
edge://flags/#allow-insecure-localhost
```
