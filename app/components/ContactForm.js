function ContactForm() {
    return (
      <div className="mt-8">
        <h2 className="text-3xl md:text-2xl font-bold text-charcoal mb-4">Contact us</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-charcoal">Name</label>
            <input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal">Email</label>
            <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-charcoal">Message</label>
            <textarea id="message" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
          </div>
          <button type="submit" className="button" >
            Send
          </button>
        </form>
      </div>
    );
  }
  
  export default ContactForm;
  