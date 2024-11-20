export default function BackgroundImage() {
  return (
    <div style={{ width: "100%", position: "relative" }} className="bg-image">
      <div
        style={{
          paddingBottom: "19.44%",
          position: "relative",
        }}
      >
        <img
          src="https://res.cloudinary.com/dwzhz9qkm/image/upload/v1732035014/bfdca9slihkgvtrbb9h0.jpg"
          alt="Mô tả ảnh"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 99,
          }}
          className="rounded-top"
        />
      </div>
    </div>
  );
}
