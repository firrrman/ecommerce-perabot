import Layout from "../component/layout";

const product = {
  name: "Baskom",
  price: "10.000",
  images: [
    {
      src: "/foto/baskom.png",
      alt: "Two each of gray, white, and black shirts laying flat.",
    },
    {
      src: "/foto/baskom.png",
      alt: "Model wearing plain black basic tee.",
    },
  ],
  colors: [
    {
      id: "1",
      name: "White",
      hex: "#fff",
    },
    {
      id: "2",
      name: "Gray",
      hex: "#000",
    },
    {
      id: "3",
      name: "Black",
      hex: "#f1f1",
    },
  ],
  sizes: [
    { id: "1", name: "10", inStock: false },
    { id: "2", name: "12", inStock: true },
    { id: "3", name: "14", inStock: true },
    { id: "4", name: "16", inStock: true },

    { id: "5", name: "20", inStock: true },
    { id: "6", name: "22", inStock: true },
    { id: "7", name: "24", inStock: true },
    { id: "8", name: "26", inStock: true },
  ],
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    "Hand cut and sewn locally",
    "Dyed with our proprietary colors",
    "Pre-washed & pre-shrunk",
    "Ultra-soft 100% cotton",
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
};
const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <Layout>
      <div className="bg-white mt-30 w-full px-5">
        <a href="/" className="bg-black text-white p-3 px-5 rounded">
          Kembali
        </a>
        <div className="pt-5 w-full">
          {/* Image gallery */}
          <div className="mt-5 flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-2 no-scrollbar sm:grid sm:grid-cols-2">
            <img
              alt={product.images[0].alt}
              src={product.images[0].src}
              className="row-span-2 aspect-square size-full object-cover"
            />
            <img
              alt={product.images[1].alt}
              src={product.images[1].src}
              className="row-span-2 aspect-square size-full object-cover"
            />
          </div>

          {/* Product info */}
          <div className=" grid lg:grid-cols-3 mt-5 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:pb-24">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.name}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                Rp. {product.price}
              </p>

              <form className="mt-10">
                {/* Colors */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Warna</h3>

                  <fieldset aria-label="Choose a color" className="mt-4">
                    <div className="flex items-center gap-x-3">
                      {product.colors.map((color) => (
                        <div
                          key={color.id}
                          className="flex rounded-full outline -outline-offset-1 outline-black/10"
                        >
                          <input
                            defaultValue={color.id}
                            defaultChecked={color === product.colors[0]}
                            name="color"
                            type="radio"
                            aria-label={color.name}
                            style={{ backgroundColor: color.hex }}
                            className={classNames(
                              `size-8 appearance-none  rounded-full forced-color-adjust-none checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3`
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>

                {/* Sizes */}
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      Ukuran
                    </h3>
                  </div>

                  <fieldset aria-label="Choose a size" className="mt-4">
                    <div className="grid grid-cols-4 gap-3">
                      {product.sizes.map((size) => (
                        <label
                          key={size.id}
                          aria-label={size.name}
                          className="group relative flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 has-checked:border-indigo-600 has-checked:bg-indigo-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-indigo-600 has-disabled:border-gray-400 has-disabled:bg-gray-200 has-disabled:opacity-25"
                        >
                          <input
                            defaultValue={size.id}
                            defaultChecked={size === product.sizes[2]}
                            name="size"
                            type="radio"
                            disabled={!size.inStock}
                            className="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
                          />
                          <span className="text-sm font-medium text-gray-900 uppercase group-has-checked:text-white">
                            {size.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <button
                  type="submit"
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
                >
                  Add to bag
                </button>
              </form>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">
                  Highlights
                </h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    {product.highlights.map((highlight) => (
                      <li key={highlight} className="text-gray-400">
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">{product.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
