export const findUserByEmailQUery = {
  text: 'SELECT* FROM users user WHERE user.email = $1',
  values: [],
}