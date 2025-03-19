import React from "react";

const WhatsNew: React.FC = () => {
  // Array of video URLs and their descriptions
  const videoCards = [
    {
      videoUrl: "https://res.cloudinary.com/dbzoophuc/video/upload/v1740303796/kwvq1x0dq6ovmszpq84k.mp4", // Replace with your video URL
      title: "Faster, fastest",
      description: "Lightweight shoes for your fastest times",
    },
    {
      videoUrl: "https://brand.assets.adidas.com/video/upload/f_auto:video,q_auto/if_w_gt_800,w_800/glbl_re_running_fw24_evergreen_catlp_navigation_card_teaser_individual_franchise_3_ultraboost_dmt_7c0d7be59f.mp4", // Replace with your video URL
      title: "Ultra energy",
      description: "Cushioned and energized daily runs",
    },
    {
      videoUrl: "https://res.cloudinary.com/dbzoophuc/video/upload/v1740303901/bukoo8zbvkigggexnrwf.mp4", // Replace with your video URL
      title: "FWD motion redefined",
      description: "Unquestionably smooth for daily runs",
    },
    {
      videoUrl: "https://res.cloudinary.com/dbzoophuc/video/upload/v1740304258/ufznaigd1xpftxmevqqw.mp4", // Replace with your video URL
      title: "Max cushioning",
      description: "Cushioned comfort and max protection",
    },
    {
      videoUrl: "https://res.cloudinary.com/dbzoophuc/video/upload/v1740304341/gtyddjvfqiosnxucpzag.mp4", // Replace with your video URL
      title: "Super comfort",
      description: "Easy everyday comfort and Support",
    },
  ];

  return (
    <section className="mt-8">
      <h2 className="text-3xl font-extrabold text-white mb-6 text-center">WHAT'S NEW</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 px-4">
        {videoCards.map((card, index) => (
          <div
            key={index}
            className="border rounded-lg shadow-md overflow-hidden max-w-[250px] mx-auto transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <video
              src={card.videoUrl}
              autoPlay
              muted
              loop
              className="w-full h-[300px] object-cover"
            ></video>
            <div className="p-4">
              <h3 className="font-semibold text-white text-lg">{card.title}</h3>
              <p className="text-sm text-white">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhatsNew;