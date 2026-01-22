import EditHotelForm from "./EditHotelForm";

async function getHotel(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return null;
  }
}

export default async function EditHotelPage({ params }) {
  const { id } = await params;
  const hotel = await getHotel(id);

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Hotel not found or failed to load.</p>
      </div>
    );
  }

  return <EditHotelForm hotel={hotel} id={id} />;
}
