module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      address: String,
      claimableToken: Number,
      claimableExp : {}
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Player = mongoose.model("player", schema);
  return Player;
};
