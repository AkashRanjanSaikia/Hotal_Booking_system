import HotelsClient from "./HotelsClient";

async function getListings() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/listings`,
      {
        next: {
          tags: ["hotels"],
          revalidate: 3600, 
        }, 
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch listings");
    }

    return await response.json();
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
}

export default async function Hotels() {
  const listings = await getListings();

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-50 pt-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py sm:py-12">
        <HotelsClient listings={listings} />
      </div>
    </div>
  );
}
