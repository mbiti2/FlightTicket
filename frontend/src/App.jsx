import { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import { FaPlaneDeparture, FaPlaneArrival, FaSearch, FaTicketAlt, FaCheckCircle } from 'react-icons/fa';
import { FlightTicketControllerApi } from './api/apis/FlightTicketControllerApi';
import { RoutePricingControllerApi } from './api/apis/RoutePricingControllerApi';
import { HelloWorldControllerApi } from './api/apis/HelloWorldControllerApi';
import { Configuration } from './api/runtime';

const BACKEND_BASE_URL = 'http://10.88.20.54:30081';

function Navbar({ page, setPage }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">FlightApp</div>
      <div className="nav-links">
        <button className={page === 'home' ? 'nav-active' : ''} onClick={() => setPage('home')}>Home</button>
        <button className={page === 'tickets' ? 'nav-active' : ''} onClick={() => setPage('tickets')}>Tickets</button>
        <button className={page === 'prices' ? 'nav-active' : ''} onClick={() => setPage('prices')}>Route Prices</button>
        <button className={page === 'hello' ? 'nav-active' : ''} onClick={() => setPage('hello')}>Hello</button>
      </div>
    </nav>
  );
}

function Home() {
  const [routes, setRoutes] = useState([]);
  const [kickoff, setKickoff] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/prices`)
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(() => setError('Failed to load routes.'));
  }, []);

  const kickoffOptions = Array.isArray(routes) ? [...new Set(routes.map(r => r.kickoffAddress))] : [];
  const destinationOptions = Array.isArray(routes) ? [...new Set(routes.map(r => r.destination))] : [];

  useEffect(() => {
    if (kickoff && destination) {
      setLoading(true);
      setError('');
      fetch(`${BACKEND_BASE_URL}/prices/search?kickoffAddress=${encodeURIComponent(kickoff)}&destination=${encodeURIComponent(destination)}`)
        .then(res => res.json())
        .then(data => {
          setPrice(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Could not fetch price.');
          setLoading(false);
        });
    } else {
      setPrice(null);
    }
  }, [kickoff, destination]);

  const handleBookNow = () => {
    setShowBooking(true);
    setBookingSuccess('');
    setBookingError('');
    setForm({ name: '', email: '', phone: '' });
  };

  const handleBookingChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async e => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingSuccess('');
    setBookingError('');
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phoneNumber: form.phone,
          bookingDate: new Date().toISOString(),
          destination,
          kickoff: new Date().toISOString(),
          pickupAddress: kickoff,
          price: price && price.normalPrice ? price.normalPrice : null
        })
      });
      if (res.ok) {
        setBookingSuccess('Booking successful! Check your email for details.');
        setShowBooking(false);
      } else {
        const data = await res.json();
        setBookingError(data.error || 'Booking failed.');
      }
    } catch {
      setBookingError('Booking failed.');
    }
    setBookingLoading(false);
  };

  return (
    <main className="hero-bg landing-hero">
      <div className="hero-glass">
        <div className="hero-icons">
          <FaPlaneDeparture className="hero-icon" />
          <FaPlaneArrival className="hero-icon" />
          <FaTicketAlt className="hero-icon" />
        </div>
        <h1 className="headline landing-headline">Find & Book Your Next Flight</h1>
        <p className="subtext landing-subtext">Seamless, affordable, and fast. Search, compare, and book flights with VIP or normal ticket options. <FaCheckCircle className="inline-icon" /></p>
        <form className="flight-form landing-form" onSubmit={e => e.preventDefault()}>
          <div className="form-row">
            <label htmlFor="kickoff">
              <span>From</span>
              <select id="kickoff" value={kickoff} onChange={e => setKickoff(e.target.value)} aria-label="Select kickoff address">
                <option value="">Select kickoff</option>
                {Array.isArray(kickoffOptions) && kickoffOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
            <label htmlFor="destination">
              <span>To</span>
              <select id="destination" value={destination} onChange={e => setDestination(e.target.value)} aria-label="Select destination">
                <option value="">Select destination</option>
                {Array.isArray(destinationOptions) && destinationOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
          </div>
          <button className="cta landing-cta" type="button" disabled={!kickoff || !destination || loading} aria-busy={loading}>
            {loading ? <span className="spinner" aria-label="Loading"></span> : <><FaSearch className="inline-icon" /> Search Flights</>}
          </button>
        </form>
        {error && <div className="error">{error}</div>}
        {price && (price.normalPrice !== null || price.vipPrice !== null) && (
          <div className="price-card landing-price-card">
            <h2>Ticket Prices</h2>
            <div className="prices">
              <div className="price-type normal">
                <span>Normal</span>
                <span className="amount">{price.normalPrice !== null ? `₦${price.normalPrice}` : '--'}</span>
              </div>
              <div className="price-type vip">
                <span>VIP</span>
                <span className="amount">{price.vipPrice !== null ? `₦${price.vipPrice}` : '--'}</span>
              </div>
            </div>
            <button className="cta book landing-book" onClick={handleBookNow} type="button">Book Now</button>
          </div>
        )}
        {price && price.message && (
          <div className="no-route">{price.message}</div>
        )}
        {showBooking && (
          <div className="modal-overlay" tabIndex={-1} aria-modal="true" role="dialog">
            <div className="modal">
              <h3>Book Your Flight</h3>
              <form className="booking-form" onSubmit={handleBookingSubmit}>
                <label htmlFor="name">Name
                  <input id="name" name="name" type="text" value={form.name} onChange={handleBookingChange} required autoFocus />
                </label>
                <label htmlFor="email">Email
                  <input id="email" name="email" type="email" value={form.email} onChange={handleBookingChange} required />
                </label>
                <label htmlFor="phone">Phone
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleBookingChange} required />
                </label>
                <button className="cta" type="submit" disabled={bookingLoading} aria-busy={bookingLoading}>
                  {bookingLoading ? <span className="spinner" aria-label="Booking..."></span> : 'Confirm Booking'}
                </button>
                <button className="modal-close" type="button" onClick={() => setShowBooking(false)} disabled={bookingLoading}>Cancel</button>
              </form>
              {bookingError && <div className="error">{bookingError}</div>}
            </div>
          </div>
        )}
        {bookingSuccess && <div className="success">{bookingSuccess}</div>}
      </div>
    </main>
  );
}

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState({ name: '', destination: '', pickupAddress: '' });
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Create API instance
  const api = new FlightTicketControllerApi(
    new Configuration({ basePath: BACKEND_BASE_URL })
  );

  const fetchTickets = () => {
    setLoading(true);
    setError('');
    api.getAllTickets()
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tickets.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    setSearching(true);
    // Convert all search values to lowercase for case-insensitive search
    const params = Object.entries(search)
      .filter(([k, v]) => v)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v.toLowerCase() }), {});
    api.searchTickets(params)
      .then(setTickets)
      .catch(() => setError('Search failed'))
      .finally(() => setSearching(false));
  };

  const handleDelete = id => {
    setDeleting(true);
    api.deleteTicket(id)
      .then(() => fetchTickets())
      .catch(() => setError('Delete failed'))
      .finally(() => { setDeleting(false); setDeleteId(null); });
  };

  return (
    <div className="page-container">
      <h2>All Tickets</h2>
      <form className="search-form" onSubmit={handleSearch}>
        <input placeholder="Name" value={search.name} onChange={e => setSearch(s => ({ ...s, name: e.target.value }))} />
        <input placeholder="Destination" value={search.destination} onChange={e => setSearch(s => ({ ...s, destination: e.target.value }))} />
        <input placeholder="Pickup Address" value={search.pickupAddress} onChange={e => setSearch(s => ({ ...s, pickupAddress: e.target.value }))} />
        <button className="cta" type="submit" disabled={searching}>{searching ? <span className="spinner" /> : 'Search'}</button>
        <button className="cta" type="button" onClick={fetchTickets}>Reset</button>
      </form>
      {loading ? <div className="spinner" /> : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Destination</th><th>Kickoff</th><th>Pickup</th><th>Price</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tickets) && tickets.map(t => (
              <tr key={t.id} className={selected === t.id ? 'selected-row' : ''}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.destination}</td>
                <td>{t.kickoff}</td>
                <td>{t.pickupAddress}</td>
                <td>{t.price ? `₦${t.price}` : '--'}</td>
                <td>
                  <button className="cta small" onClick={() => setSelected(t.id)}>View</button>
                  <button className="cta small danger" onClick={() => { setDeleteId(t.id); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {deleteId && (
        <div className="modal-overlay"><div className="modal">
          <p>Are you sure you want to delete ticket #{deleteId}?</p>
          <button className="cta danger" onClick={() => handleDelete(deleteId)} disabled={deleting}>{deleting ? <span className="spinner" /> : 'Delete'}</button>
          <button className="modal-close" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</button>
        </div></div>
      )}
      {selected && (
        <div className="modal-overlay"><div className="modal">
          <h3>Ticket Details</h3>
          {(() => {
            const t = Array.isArray(tickets) ? tickets.find(t => t.id === selected) : null;
            if (!t) return <div style={{ color: '#888' }}>Ticket not found.</div>;
            return (
              <div className="ticket-details-modal">
                <div><b>ID:</b> {t.id ?? '--'}</div>
                <div><b>Name:</b> {t.name ?? '--'}</div>
                <div><b>Email:</b> {t.email ?? '--'}</div>
                <div><b>Phone:</b> {t.phoneNumber ?? '--'}</div>
                <div><b>Destination:</b> {t.destination ?? '--'}</div>
                <div><b>Kickoff:</b> {t.kickoff ?? '--'}</div>
                <div><b>Pickup Address:</b> {t.pickupAddress ?? '--'}</div>
                <div><b>Price:</b> {t.price ? `₦${t.price}` : '--'}</div>
              </div>
            );
          })()}
          <button className="modal-close" onClick={() => setSelected(null)} style={{ marginTop: '1.2rem' }}>Close</button>
        </div></div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

function Prices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ kickoffAddress: '', destination: '', normalPrice: '', vipPrice: '' });
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState({ kickoffAddress: '', destination: '' });
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchMessage, setSearchMessage] = useState('');

  const api = new RoutePricingControllerApi(
    new Configuration({ basePath: BACKEND_BASE_URL })
  );

  const fetchPrices = () => {
    setLoading(true);
    api.getAllPrices()
      .then(setPrices)
      .catch(() => setError('Failed to load prices'))
      .finally(() => setLoading(false));
  };
  useEffect(fetchPrices, []);

  const handleAdd = e => {
    e.preventDefault();
    setAdding(true);
    api.addPrice({
      kickoffAddress: form.kickoffAddress,
      destination: form.destination,
      normalPrice: parseFloat(form.normalPrice),
      vipPrice: parseFloat(form.vipPrice)
    })
      .then(() => { setShowAdd(false); setForm({ kickoffAddress: '', destination: '', normalPrice: '', vipPrice: '' }); fetchPrices(); })
      .catch(() => setError('Add failed'))
      .finally(() => setAdding(false));
  };

  const handleSearch = e => {
    e.preventDefault();
    setSearching(true);
    setSearchMessage('');
    api.searchPrice({
      kickoffAddress: search.kickoffAddress.toLowerCase(),
      destination: search.destination.toLowerCase()
    })
      .then(data => {
        setSearchResult(data);
        if (data && (data.normalPrice !== null || data.vipPrice !== null)) {
          setSearchMessage('Route found:');
        } else {
          setSearchMessage('Route not available.');
        }
      })
      .catch(() => setError('Search failed'))
      .finally(() => setSearching(false));
  };

  return (
    <div className="page-container">
      <h2>All Route Prices</h2>
      <button className="cta" onClick={() => setShowAdd(true)}>Add Route Price</button>
      <form className="search-form" onSubmit={handleSearch}>
        <input placeholder="Kickoff Address" value={search.kickoffAddress} onChange={e => setSearch(s => ({ ...s, kickoffAddress: e.target.value }))} />
        <input placeholder="Destination" value={search.destination} onChange={e => setSearch(s => ({ ...s, destination: e.target.value }))} />
        <button className="cta" type="submit" disabled={searching}>{searching ? <span className="spinner" /> : 'Search'}</button>
      </form>
      {searchResult && (
        <div className="price-card">
          <h3>{searchMessage}</h3>
          <div><b>Kickoff:</b> {searchResult.kickoffAddress ?? '--'}</div>
          <div><b>Destination:</b> {searchResult.destination ?? '--'}</div>
          <div><b>Normal Price:</b> {searchResult.normalPrice !== null && searchResult.normalPrice !== undefined ? `₦${searchResult.normalPrice}` : '--'}</div>
          <div><b>VIP Price:</b> {searchResult.vipPrice !== null && searchResult.vipPrice !== undefined ? `₦${searchResult.vipPrice}` : '--'}</div>
          {searchResult.message && <div className="no-route">{searchResult.message}</div>}
        </div>
      )}
      {loading ? <div className="spinner" /> : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th><th>Kickoff</th><th>Destination</th><th>Normal Price</th><th>VIP Price</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(prices) && prices.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                  No route prices found.
                </td>
              </tr>
            ) : (
              Array.isArray(prices) && prices.map(p => (
                <tr key={p.id}>
                  <td>{p.id ?? '--'}</td>
                  <td>{p.kickoffAddress ?? '--'}</td>
                  <td>{p.destination ?? '--'}</td>
                  <td>{p.normalPrice !== null && p.normalPrice !== undefined ? `₦${p.normalPrice}` : '--'}</td>
                  <td>{p.vipPrice !== null && p.vipPrice !== undefined ? `₦${p.vipPrice}` : '--'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {showAdd && (
        <div className="modal-overlay"><div className="modal">
          <h3>Add Route Price</h3>
          <form className="booking-form" onSubmit={handleAdd}>
            <label>Kickoff Address<input value={form.kickoffAddress} onChange={e => setForm(f => ({ ...f, kickoffAddress: e.target.value }))} required /></label>
            <label>Destination<input value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} required /></label>
            <label>Normal Price<input type="number" min="0" step="0.01" value={form.normalPrice} onChange={e => setForm(f => ({ ...f, normalPrice: e.target.value }))} required /></label>
            <label>VIP Price<input type="number" min="0" step="0.01" value={form.vipPrice} onChange={e => setForm(f => ({ ...f, vipPrice: e.target.value }))} required /></label>
            <button className="cta" type="submit" disabled={adding}>{adding ? <span className="spinner" /> : 'Add'}</button>
            <button className="modal-close" type="button" onClick={() => setShowAdd(false)} disabled={adding}>Cancel</button>
          </form>
        </div></div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

function Hello() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const api = new HelloWorldControllerApi(
    new Configuration({ basePath: BACKEND_BASE_URL })
  );

  // Fetch greeting as a chat message
  const handleGreet = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.hello(input);
      setMessages(msgs => [...msgs, { sender: 'server', text: response }]);
    } catch {
      setMessages(msgs => [...msgs, { sender: 'server', text: 'Failed to get greeting.' }]);
    }
    setLoading(false);
  };

  // Send a chat message (POST)
  const handlePost = async (e) => {
    e.preventDefault();
    setPostLoading(true);
    try {
      const response = await api.sendGreetings(input);
      setMessages(msgs => [...msgs, { sender: 'server', text: response }]);
    } catch {
      setMessages(msgs => [...msgs, { sender: 'server', text: 'Failed to send greeting.' }]);
    }
    setPostLoading(false);
  };

  return (
    <div className="page-container">
      <h2>Chatboard</h2>
      <div className="chatboard">
        {Array.isArray(messages) && messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === 'server' ? 'chat-msg server' : 'chat-msg user'}>{msg.text}</div>
        ))}
      </div>
      <form className="search-form" onSubmit={handleGreet} style={{ marginBottom: 8 }}>
        <input placeholder="Say hello..." value={input} onChange={e => setInput(e.target.value)} />
        <button className="cta" type="submit" disabled={loading}>{loading ? <span className="spinner" /> : 'Greet (GET)'}</button>
      </form>
      <form className="search-form" onSubmit={handlePost}>
        <input placeholder="Send a message..." value={input} onChange={e => setInput(e.target.value)} />
        <button className="cta" type="submit" disabled={postLoading}>{postLoading ? <span className="spinner" /> : 'Send (POST)'}</button>
      </form>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  return (
    <>
      <Navbar page={page} setPage={setPage} />
      {page === 'home' && <Home />}
      {page === 'tickets' && <Tickets />}
      {page === 'prices' && <Prices />}
      {page === 'hello' && <Hello />}
    </>
  );
}
