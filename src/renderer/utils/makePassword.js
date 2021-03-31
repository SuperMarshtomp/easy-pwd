/*
 * @Description: 介绍
 * @Author: chenyongxuan
 * @Date: 2021-03-31 10:55:47
 * @LastEditors: chenyongxuan
 * @LastEditTime: 2021-03-31 14:37:44
 */

function getRondomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}

function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48)
}
function getRandomSymbol(value) {
  const symbols = value || '~!@#$%^&*()_+{}":?><;.,'
  return symbols[Math.floor(Math.random() * symbols.length)]
}

const randomFunc = {
  lower: getRondomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol
}

export default (length, rules) => {
  let generatedPassword = ''
  // const typesCount = lower + upper + number + symbol
  // const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
  //   item => Object.values(item)[0]
  // )
  // if (typesCount === 0) {
  //   return ''
  // }
  if (!length || !rules || rules.length === 0) return ''
  for (let i = 0; i < length; i++) {
    rules.forEach(item => {
      generatedPassword += randomFunc[item.name](item.value)
    })
  }
  return generatedPassword.slice(0, length)
}
