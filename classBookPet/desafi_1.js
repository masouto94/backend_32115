class Usuario {

    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }
    getFullName() {
        return `${this.nombre} ${this.apellido}`
    }

    addMascotas(mascotas) {
        this.mascotas = this.mascotas.concat(mascotas)
    }

    countMascotas() {
        return this.mascotas.length
    }

    addBooks(libros) {
        const librosNuevos = libros.map(libro => {
            let objeto = {nombre: libro.nombre, autor: libro.autor}
            return objeto
            })
        this.libros = this.libros.concat(librosNuevos)
    }

    getBookNames(){
    const bookNames = this.libros.map((libro) => libro.nombre)
    return bookNames
    }

 
}

let user = new Usuario('matias', 'souto', [{ nombre: 'guerra y paz', autor: 'Lev Tolstoi' }], ['arnold', 'mefistofeles'])
console.log(`Objeto entero: ${JSON.stringify(user)}\n#####`)

let fullName = user.getFullName()
console.log(`Nombre completo: ${fullName}\n#####`)

user.addMascotas('michi')
console.log(`Mascotas actuales: ${user.mascotas}\n#####`)

user.addMascotas(['Luana la iguana', 'Rodolfo'])
console.log(`Mascotas actuales: ${user.mascotas}\n#####`)


let totalMascotas = user.countMascotas()
console.log(`Total de mascotas: ${totalMascotas}\n#####`)

user.addBooks([{nombre:'colmillo blanco', autor:'Jack London'}])
console.log(`Libros actuales: ${JSON.stringify(user.libros)}\n#####`)

let totalLibros = user.getBookNames()
console.log(`Nombres de libros: ${totalLibros}\n#####`)