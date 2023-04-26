const yup = require("yup")

const mixed = {
  default: "${path} é inválido",
  notType: "${path} é um campo obrigatório",
  required: "${path} é um campo obrigatório",
  oneOf: "${path} deve ser um dos seguintes valores: ${values}",
  notOneOf:
    "${path} não deve corresponder a nenhum dos seguintes valores: ${values}",
}

yup.setLocale({
  mixed,
  string: {
    ...mixed,
    length: "${path} deve conter exatamente ${length} caracteres",
    min: "${path} deve conter pelo menos ${min} caracteres",
    max: "${path} não pode exceder ${max} caracteres",
    matches: '${path} deve ficar assim: "${regex}"',
    email: "${path} precisa ser um e-mail válido",
    url: "${path} deve ser um URL válido",
    trim: "${path} não pode conter espaços no início ou no final",
    lowercase: "${path} pode conter apenas minúsculas",
    uppercase: "${path} pode conter apenas letras maiúsculas",
  },
  number: {
    ...mixed,
    min: "${path} deve ser maior ou igual a ${min}",
    max: "${path} deve ser menor ou igual a ${max}",
    lessThan: "${path} deve ser menor que ${less}",
    moreThan: "${path} deve ser maior que ${more}",
    positive: "${path} deve ser um número positivo",
    negative: "${path} deve ser um número negativo",
    integer: "${path} deve ser um inteiro",
  },
  date: {
    ...mixed,
    min: "${path} deve ser posterior a ${min}",
    max: "${path} deve ser anterior a ${max}",
  },
  boolean: {
    ...mixed,
  },
  object: {
    ...mixed,
    noUnknown:
      '${path}-Campo não pode usar chaves que não estão definidas na "Forma de objeto"',
  },
  array: {
    ...mixed,
    min: "${path}-O campo deve ter pelo menos ${min} entradas",
    max: "${path}-O campo pode ter no máximo ${max} entradas",
  },
})

module.exports = yup
