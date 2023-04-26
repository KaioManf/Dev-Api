const yup = require("../utils/internationalization")
const { Product } = require("../models")

module.exports = class ProductController {
  async getAll(request, response) {
    const product = await Product.findAll()

    response.json({
      product,
    })
  }

  async findOne(request, response) {
    const findProductSchema = yup.object({
      id: yup.number().integer().positive().required(),
    })

    const parsedProduct = await findProductSchema
      .validate({ id: Number(request.params.id) })
      .catch((error) => {
        response.statusCode = 400
        response.json(error)
      })

    if (!parsedProduct) {
      return
    }

    const product = await Product.findByPk(parsedProduct.id)

    if (!product) {
      response.statusCode = 404
      response.json({
        error: "Produto não encontrado!",
      })
      return
    }

    response.json(product)
  }

  async create(request, response) {
    const newProductSchema = yup.object({
      name: yup.string().required(),
      price: yup.number().positive(),
      imageUrl: yup.string().url(),
    })

    const parsedProduct = await newProductSchema.validate({
      name: request.body.name,
      price: request.body.price,
      imageUrl: request.body.imageUrl,
    })

    const product = await Product.create(parsedProduct)

    response.json(product)
  }

  async update(request, response) {
    const updateProductSchema = yup.object({
      id: yup.number().integer().positive().required(),
      name: yup.string().required(),
      price: yup.number().positive(),
      imageUrl: yup.string().url(),
    })

    const parsedProduct = await updateProductSchema.validate({
      id: Number(request.params.id),
      name: request.body.name,
      price: request.body.price,
      imageUrl: request.body.imageUrl,
    })

    const updatedProduct = await Product.update(parsedProduct, {
      where: {
        id: parsedProduct.id,
      },
    })

    response.json(updatedProduct)
  }

  async patch(request, response) {
    const patchProductSchema = yup.object({
      id: yup.number().integer().positive().required(),
      name: yup.string(),
      price: yup.number().positive(),
      imageUrl: yup.string().url(),
    })

    const parsedProduct = await patchProductSchema.validate({
      ...request.body,
      id: Number(request.params.id),
    })

    const updatedProduct = await Product.update(parsedProduct, {
      where: {
        id: parsedProduct.id,
      },
    })

    response.json(updatedProduct)
  }

  async delete(request, response) {
    const deleteProductSchema = yup.object({
      id: yup.number().integer().positive().required(),
    })

    const parsedProduct = await deleteProductSchema
      .validate({ id: Number(request.params.id) })
      .catch((error) => {
        response.statusCode = 400
        response.json(error)
      })

    if (!parsedProduct) {
      return
    }

    const product = await Product.findByPk(parsedProduct.id)

    if (!product) {
      response.statusCode = 404
      response.json({
        error: "Produto não encontrado!",
      })
      return
    }

    await Product.destroy({
      where: {
        id: parsedProduct.id,
      },
    })

    response.statusCode = 204
    response.end()
  }
}
