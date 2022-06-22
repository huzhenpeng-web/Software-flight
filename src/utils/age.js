/* 计算年龄 */

export function getAge (identityCard) {
  const len = (identityCard + '').length
  let strBirthday = ''
  if (len === 18) {
    // 处理18位的身份证号码从号码中得到生日和性别代码
    strBirthday = identityCard.substr(6, 4) + '/' + identityCard.substr(10, 2) + '/' + identityCard.substr(12, 2)
  }
  if (len === 15) {
    let birthdayValue = ''
    birthdayValue = identityCard.charAt(6) + identityCard.charAt(7)
    if (parseInt(birthdayValue) < 10) {
      strBirthday = '20' + identityCard.substr(6, 2) + '/' + identityCard.substr(8, 2) + '/' + identityCard.substr(10, 2)
    } else {
      strBirthday = '19' + identityCard.substr(6, 2) + '/' + identityCard.substr(8, 2) + '/' + identityCard.substr(10, 2)
    }
  }
  const birthDate = new Date(strBirthday)
  const nowDateTime = new Date()
  let age = nowDateTime.getFullYear() - birthDate.getFullYear()
  // 再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() === birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
