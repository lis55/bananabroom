// components/BookingForm.
'use client'
import CleaningForm from "./CleaningForm";
import PaintinForm from "./PaintingForm"


export default function BookingForm({serviceType}) {
  const googleFormUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM;
if (serviceType==1){

    return (
    <div className="iframe-container">
      {/* <iframe src={googleFormUrl} title="Painting Form" frameborder="2" width="100%" height="820"></iframe> */}
    <CleaningForm/>
    </div>
  );
}

if (serviceType==2){

  return (
  <div className="iframe-container">
    {/* <iframe src={googleFormUrl} title="Painting Form" frameborder="2" width="100%" height="820"></iframe> */}
  <PaintinForm/>
  </div>
);
}

if (serviceType==2){

  return (
  <div className="iframe-container">
    {/* <iframe src={googleFormUrl} title="Painting Form" frameborder="2" width="100%" height="820"></iframe> */}
  <SitterForm/>
  </div>
);
}

  }
  