import { Card, CardHeader, CardBody, Image, Spacer } from "@nextui-org/react";
import Link from "next/link";

async function fetchGuidedTours() {
  let url = `http://127.0.0.1:8000/api/v2/tours/guided?length=8`;
  let response = await fetch(url, {
    next: { revalidate: 60 },
    headers: {
      "Content-Type": "application/json",
      "x-api-code": "hoho-code-hohobooking030224",
      "x-api-key": "hoho-keyoDzHXAw9xHTPtqfinCF4lwWST030224",
    },
  });

  return await response.json();
}

export default async function GuidedTours() {
  let tours = await fetchGuidedTours();
  tours = tours.data;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 gap-5">
      {tours.map((tour) => (
        <Link href={`/tours/guided/${tour.id}`}>
          <Card className="py-4" key={tour.id}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <h4 className="font-bold text-medium text-black">
                {tour.name.length > 20
                  ? tour.name.substr(0, 20) + "..."
                  : tour.name}
              </h4>
              <small className="text-default-500">{tour.type}</small>
              {/* <p className="text-small uppercase font-bold text-primary">P {parseFloat(tour.price).toFixed(2)}</p> */}
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src={`https://dashboard.philippines-hoho.ph/assets/img/tours/${tour.id}/${tour.featured_image}`}
                width={"100%"}
              />
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  );
}
