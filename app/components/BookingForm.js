// components/BookingForm.js
export default function BookingForm() {
  const googleFormUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM;

  return (
    <div className="iframe-container">
      <iframe src={googleFormUrl} title="Painting Form" frameborder="0" width="100%" height="520"></iframe>
    </div>
  );
  }
  