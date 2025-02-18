const { Schema, model,mongoose } = require('mongoose')

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    slug: {
        type: String,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies"
    },
}, { timestamps: true })

categorySchema.index({
    name: 'text'
})

module.exports = model('categorys', categorySchema)