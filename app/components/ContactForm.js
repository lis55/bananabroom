function ContactForm() {
  return (
    <div >
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
      <form className="space-y-6" name="contact" method="POST" data-netlify="true">
        <input type="hidden" name="form-name" value="contact" />
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-banana-500 focus:border-banana-500" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-banana-500 focus:border-banana-500" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="message" name="message" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-banana-500 focus:border-banana-500"></textarea>
        </div>
        <button type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
