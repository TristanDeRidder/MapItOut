import Box from "../components/Box/Box";

const Continent = () => {
  return (
    <>
      {/* Controls */}
      {/* <OrbitControls makeDefault /> */}

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1} />

      {/* Models */}
      <Box color="red" />
    </>
  );
};

export default Continent;
