module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      ownerAddress: String,
      heroes: [String],
      items: [String],
      target: [String],
      result : {type: String, enum : ['WIN','LOSS','SURRENDER']},
      reward : {type: Number, default: 0}
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Battle = mongoose.model("battle", schema);
  return Battle;
};
