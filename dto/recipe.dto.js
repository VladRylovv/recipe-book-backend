const UserDto = require("./user.dto")

module.exports = class RecipeDto {
    id;
    name;
    img;
    user;
    description;

    constructor(data, user) {
        this.id = data.id
        this.name = data.name
        this.img = data.img
        this.description = data.description
        this.user = user ? {...new UserDto(user)} : null
    }
}
