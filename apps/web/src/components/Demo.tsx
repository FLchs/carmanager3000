function Card() {
  return (
    <div className="rounded-2xl p-4 bg-elevated border-highlight border-1">
      <div>
        <img className="h-12 absolute" src="/kia-logo.png" />
        <img className="w-full h-72" src="/kia-magentis.jpg" />
      </div>
      <div className="flex gap-4 mt-4 justify-between">
        <div>
          <h3 className="font-bold mb-2 text-base">Magentis</h3>
          <p className="text-muted">Kia Magentis MG - 2008</p>
          <p className="text-muted">2.0 CVVT - 144hp</p>
        </div>
        <span className="text-muted hover:text-white hover:cursor-pointer h-6">
          ⠇
        </span>
      </div>
    </div>
  );
}

function Demo() {
  return (
    <div>
      <h1 className="text-2xl">Card:</h1>
      <div className="flex flex-col gap-4 w-[600px] m-auto">
        <Card />
      </div>
    </div>
  );
}

export default Demo;
