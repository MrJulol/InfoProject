const app = require("express")();


const PORT = 3500


app.get("/", (_, res) => {
	return res.send("<p>Hello</p>")
})

app.listen(3500, () => {
	console.log("Server started")
})
