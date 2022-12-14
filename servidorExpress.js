const fs = require('fs');

class Contenedor {
    constructor(nombre) {
        this.nombre = nombre;
    }
    async deleteByID(id){
        try{
            const data = await fs.promises.readFile(`${this.nombre}`, 'utf8')
            const arrayProductos = JSON.parse(data);
            arrayProductos.map(producto =>{
                if (producto.id === id){
                    const i = arrayProductos.indexOf(producto);
                    arrayProductos.splice(i, 1);
                    fs.promises.writeFile(`${this.nombre}`, JSON.stringify(arrayProductos))
                }
            })
        }catch(error){
            throw(error)
        }
    }
    async save(title, price, thumbnail) {
        try {
            const data = await fs.promises.readFile(`${this.nombre}`, 'utf8')
            const arrayProductos = JSON.parse(data);
            arrayProductos.push({
                id: arrayProductos.length + 1,
                title: title,
                price: price,
                thumbnail: thumbnail
            });
            await fs.promises.writeFile(`./${this.nombre}`, JSON.stringify(arrayProductos, null, '\t'));

        } catch (error) {
            throw error;
        }
    }
    async getAll() {
        let Object = []
        try {
            Object = await fs.promises.readFile(`./${this.nombre}`, 'utf8')
            console.log(JSON.parse(Object));
            return JSON.parse(Object);
        } catch (error) {
            console.log(Object);
            throw error
        }
    }
    async obtenerID(id){
        try{
            const data = await fs.promises.readFile(`${this.nombre}`, 'utf8')
            const arrayProductos = JSON.parse(data);
            const producto =  arrayProductos.find((producto) => producto.id === id);
            return producto
        }catch (error){
            throw error
        }
    }
    async deleteAll() {
        try {
            await fs.promises.unlink(`./${this.nombre}`, 'utf8')
        } catch (error) {
            throw error;
        }
    }

}





const express = require('express');
const { allowedNodeEnvironmentFlags } = require('process');

const app = express()

const PORT = 8888;

const server = app.listen(PORT, () =>{
    console.log(`Servidor corriendo en el puerto ${server.address().port}`)
})
server.on("error" , error => console.log(`error en servidor ${error}`))

const contenedor =  new Contenedor("productos.json")

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
app.get('/' , (req , res) =>{
    res.send({mensaje : 'Hola coders'})
})
app.get('/productos' , async (req , res) => {
    const allProducts = await contenedor.getAll();
    res.send(allProducts);
}) 
app.get('/productorandom' , async (req , res) => {
    const allProducts = await contenedor.getAll();
    const maxID =  allProducts.length;

    const randomNumber = grn(1 , maxID)
    const randomProduct = await contenedor.obtenerID(randomNumber)
    res.json(randomProduct)
}) 
const grn = (min, max) => {
    return Math.floor((Math.random() * (max+1 -min)) +min);
}