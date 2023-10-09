const UserDto = require("./user.dto")

module.exports = class RecipeDto {
    id;
    name;
    img;
    user;
    description;
    createdAt;
    isChecked

    constructor(data, user) {
        this.id = data.id
        this.name = data.name
        this.img = data.img
        this.description = data.description
        this.user = user ? {...new UserDto(user)} : null
        this.createdAt = data.created_at
        this.isChecked = data.is_checked
    }
}
