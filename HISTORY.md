# MITEN PROJEKTI TOTEUTETTIIN???

## tehdään kansiosta git-repositorio
    git init
## ja lisätään .gitignore

## luodaan projekti
    npm init

## otetaan käyttöö typescript
    npm install typescript --save-dev

## lisätään tsc package.json-skripteihin
    "tsc": "tsc"

## initialisoidaan tsconfig.json
    npm run tsc -- --init
## käydään muokkaamassa juuri luotu tsconfig.json halutun laiseksi

## installoidaan kirjastoja
    npm install express --save
    npm install @types/express --save-dev
    npm install apollo-server-express --save
    npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
    npm install --cross-env

## luodaan halutun lainen .eslintrc-tiedosto, ja lisätään .eslintignore

## installoidaan kehityksen aikainen "nodemon"
    npm install --save-dev ts-node-dev
## asetetaan sille käynnistys-script (käytettäväksi development-vaiheessa)
## lisätään käynnistys-script käytettäväksi production-vaiheessa

## luodaan index.ts-tiedosto

## installoidaan testejä varten
    npm install jest
    npm install supertest
    npm install ts-jest
    npm install @types/jest
    npm install @types/supertest
## lisätään testien käynnistämiseksi scripti

## installoidaan graphql
    npm install graphql --save
     npm install @types/graphql --save

## Mitä?
    Nyt käytetään apollo-server-instanssia middlewarena Expressille.
    Näin voidaan tarjota serveriltä sekä  REST että GraphQL-kutsuja, 
    mikä on hyvä, kun halutaan ehkä serverille salasanan asetus,
    joka ei tapahdu GraphQL:n kautta.
    Huonona puolena on se, että apollo-server-express on hitaampi. 
    Tässä se ei nyt haittaa.

## Kyselyt:
    Kyselyt voidaan lähettää Playgroundin avulla: http://localhost:4000/graphql.
    Kaikki graphql-kyselyt lähetetään yo. osoitteeseen.
    Voidaan myös lähettää "tavallinen" kysely "http://localhost:4000/health"
    ja vastaukseksi pitäisi saada "OK" (tämä route ei siis ole graphql-route 
    vaan tavallinen Express-route).

## GitHub:
    Luodaan uusi repositorio GitHubiin, ja tehdään siitä etärepositorio.
        git remote add origin git@github.com:satuhyva/swaplings_server.git
    Lähetetään repositorio GitHubiin:
        git push -u origin master
    
## Luotiin uusi Heroku app:
    heroku create swaplings

## GitHub actions:
    Luodaan pipeline.yml-tiedosto, jonka avulla deployment Herokuun.
    Heroku Account settingsistä saadaan Heroku API KEY.
    Tämä annetaan GitHub secret'inä. Samoin APP NAME JA HEROKU EMAIL.
    Lisätään Procfile, jotta Heroku osaa käynnistyä.