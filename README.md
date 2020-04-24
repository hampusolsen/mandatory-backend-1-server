# Slackers REST API server

## Handling of sensitive data
Sensitive data, such as passwords, is stored only after being hashed.

### libraries
- bcrypt

## Access validation
Access validation is handled with JSON web tokens (access and refresh).

### libraries
- jsonwebtoken

## Real-time packet management
Using websocket.

### libraries
- socket.io
- socket.io-client

## Testing
### libraries
- mocha (server)
- jest (client)

# Inlämning
Inlämningen ska ske på Ping Pong. Lämna in en länk till ett git repository. Uppgiften ska ha gjorts på **master** branchen.  

## Resurser
[nodejs](https://nodejs.org/api/)
[socket.io](https://socket.io/)

## Instruktioner
Du ska bygga en chat-applikation. Det ska finnas både en frontend samt en backend för applikationen. Det finns inga krav på hur frontenden ska se ut eller fungera.

* Chatten ska som slack ha stöd för flera rum - dvs skriver man i ett specifikt rum ska meddelandet endast visa i rummet. 
* Man ska kunna skapa och ta bort rum - alla rum ska ha ett unikt namn
* Varje meddelande har info om vem som skrev det
* Chatten ska ha stöd för real-time meddelanden
* Rummen & alla meddelanden ska sparas långsiktigt (t.ex. i en eller flera filer). Dvs när man startar om servern ska allting vara kvar

## Bonuspoäng
* Visa alla användare som är aktiva i chatten
* Lägg till logik för “skriver just nu “ (visas oftas som ... )
* Lägg till låsta rum - ett rum som kräver att man anger ett lösenord för att kunna komma åt
* Direktmeddelanden till andra användare
* Profilbilder
* Emojis [react-emojione](https://www.npmjs.com/package/react-emojione)
* Editera & ta bort gamla meddelanden