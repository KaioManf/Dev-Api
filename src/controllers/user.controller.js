const yup = require("../utils/internationalization")
const bcrypt = require("bcrypt")
const { User } = require("../models")
const UserService = require("../services/user.service")

const userService = new UserService()

module.exports = class UserController {
  async login(request, response) {
    const userLoginSchema = yup.object({
      password: yup.string().required(),
      email: yup.string().email().required()
    })

    const parsedRequest = await userLoginSchema
      .validate(request.body)
      .catch((error) => {
        response.statusCode = 400
        response.json(error)
      })

    const user = await User.findOne({
      where: {
        email: parsedRequest.email,
      },
    })

    if (!user?.dataValues) {
      response.statusCode = 404
      response.json({
        error: "Usuário não encontrado!",
      })
      return
    }

    const { password: hash, ...userInformation } = user.dataValues

    const isPasswordCorrect = await bcrypt.compare(parsedRequest.password, hash)

    if (!isPasswordCorrect) {
      response.statusCode = 400
      response.json({
        error: "Senha incorreta!",
      })
      return
    }

    const token = userService.generateToken(
      userInformation,
      request.get("user-agent")
    )

    response.json({
      data: userInformation,
      token,
    })
  }

  async getAll(request, response) {
    const databaseUsers = await User.findAll()

    const users = databaseUsers.map((user) => {
      const { password, ...userWithoutPassword } = user.dataValues

      return userWithoutPassword
    })

    response.json({
      users,
    })
  }

  async findOne(request, response) {
    const id = Number(request.params.id)

    if (!id || Number.isNaN(id)) {
      response.statusCode = 404
      response.json({
        error: "É necessário passar um id para buscar um usuário!",
      })
      return
    }

    const user = await User.findByPk(id)

    if (!user) {
      response.statusCode = 404
      response.json({
        error: "Usuário não encontrado!",
      })
      return
    }

    const { password, ...userWithoutPassword } = user.dataValues

    response.json(userWithoutPassword)
  }

  async create(request, response) {
    const createUserSchema = yup.object({
      name: yup
        .string()
        .min(3)
        .matches(
          /^[A-Za-z]([-']?[A-Za-z]+)*( [A-Za-z]([-']?[A-Za-z]+)*)+$/,
          "Formato do nome inválido"
        )
        .required(),
      age: yup.number().integer().positive(),
      cpf: yup.string().min(11).max(11),
      phoneNumber: yup.string(),
      birthDate: yup.string().min(10).max(10),
      password: yup.string().min(8).required(),
      email: yup.string().email().required(),
      cargoUser: yup.string().required()
    })

    const parsedUser = await createUserSchema
      .validate(request.body)
      .catch((error) => {
        response.statusCode = 400
        response.json(error)
      })

    if (!parsedUser) {
      return
    }

    const saltRounds = 10
    const hash = await bcrypt.hash(parsedUser.password, saltRounds)

    const user = await User.create({
      ...parsedUser,
      password: hash,
    })

    response.json(user)
  }

  async update(request, response) {
    const updateUserSchema = yup.object({
      id: yup.number().integer().positive().required(),
      name: yup
        .string()
        .min(3)
        .matches(
          /^[A-Za-z]([-']?[A-Za-z]+)*( [A-Za-z]([-']?[A-Za-z]+)*)+$/,
          "Formato do nome inválido"
        )
        .required(),
      age: yup.number().integer().positive(),
      cpf: yup.string().min(11).max(11),
      phoneNumber: yup.string(),
      birthDate: yup.string().min(10).max(10),
      password: yup.string().min(8).required(),
      email: yup.string().email().required(),
    })

    const parsedUser = await updateUserSchema
      .validate({
        ...request.body,
        id: Number(request.params.id),
      })
      .catch((error) => {
        response.statusCode = 400
        response.json(error)
      })

    if (!parsedUser) {
      return
    }

    const saltRounds = 10
    const hash = await bcrypt.hash(parsedUser.password, saltRounds)

    const updatedUser = await User.update(
      {
        ...parsedUser,
        password: hash,
      },
      {
        where: {
          id: parsedUser.id,
        },
      }
    )

    response.json(updatedUser)
  }

  async patch(request, response) {
    const patchUserSchema = yup.object({
      id: yup.number().integer().positive().required(),
      name: yup
        .string()
        .min(3)
        .matches(
          /^[A-Za-z]([-']?[A-Za-z]+)*( [A-Za-z]([-']?[A-Za-z]+)*)+$/,
          "Formato do nome inválido"
        ),
      age: yup.number().integer().positive(),
      cpf: yup.string().min(11).max(11),
      phoneNumber: yup.string(),
      birthDate: yup.string().min(10).max(10),
      password: yup.string().min(8),
      email: yup.string().email(),
    })

    const parsedUser = await patchUserSchema
      .validate({
        ...request.body,
        id: Number(request.params.id),
      })
      .catch((error) => {
        response.statusCode = 400
        response.json(error)
      })

    if (!parsedUser) {
      return
    }

    const saltRounds = 10
    const hash = parsedUser.password
      ? await bcrypt.hash(parsedUser.password, saltRounds)
      : null

    const user = parsedUser.password
      ? {
        ...parsedUser,
        password: hash,
      }
      : parsedUser

    const updatedUser = await User.update(user, {
      where: {
        id: parsedUser.id,
      },
    })

    response.json(updatedUser)
  }

  async delete(request, response) {
    const deleteUserSchema = yup.object({
      id: yup.number().integer().positive().required(),
    })

    const parsedUser = await deleteUserSchema
      .validate({ id: Number(request.params.id) })
      .catch((error) => {
        response.statusCode = 400
        response.json(error)
      })

    if (!parsedUser) {
      return
    }

    const user = await User.findByPk(parsedUser.id)

    if (!user) {
      response.statusCode = 404
      response.json({
        error: "Usuário não encontrado!",
      })
      return
    }

    await User.destroy({
      where: {
        id: Number(request.params.id),
      },
    })

    response.statusCode = 204
    response.end()
  }
}
