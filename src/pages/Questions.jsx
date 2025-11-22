// src/pages/Resources.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const LOCAL_KEY = 'sams_authenticated';
const CORRECT_PASSWORD = 'SAMS354790';

function Resources() {
  const [resources, setResources] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [expandedResource, setExpandedResource] = useState(null);

  const [enteredPassword, setEnteredPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Remember login
  useEffect(() => {
    if (localStorage.getItem(LOCAL_KEY) === 'true') setAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e && e.preventDefault();
    if (enteredPassword.trim() === CORRECT_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem(LOCAL_KEY, 'true');
    } else {
      alert('Incorrect password. Try again!');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setEnteredPassword('');
    localStorage.removeItem(LOCAL_KEY);
    setYears([]);
    setTopics([]);
    setSelectedYear('');
    setSelectedTopic('');
    setResources([]);
    setExpandedResource(null);
  };

  // Fetch all years
  useEffect(() => {
    if (!authenticated) return;
    const unsubscribe = onSnapshot(collection(db, 'resources'), snapshot => {
      const uniqueYears = new Set();
      snapshot.forEach(doc => {
        const data = doc.data() || {};
        if (data.year) uniqueYears.add(data.year);
      });
      setYears(Array.from(uniqueYears).sort());
    });
    return () => unsubscribe();
  }, [authenticated]);

  // Fetch topics when year changes
  useEffect(() => {
    if (!authenticated || !selectedYear) {
      setTopics([]);
      setSelectedTopic('');
      return;
    }

    const q = query(collection(db, 'resources'), where('year', '==', selectedYear));
    const unsubscribe = onSnapshot(q, snapshot => {
      const uniqueTopics = new Set();
      snapshot.forEach(doc => {
        const data = doc.data() || {};
        if (data.topic) uniqueTopics.add(data.topic);
      });
      setTopics(Array.from(uniqueTopics).sort());
      setSelectedTopic(''); // reset topic on year change
    });

    return () => unsubscribe();
  }, [selectedYear, authenticated]);

  // Fetch resources when year + topic change
  useEffect(() => {
    if (!authenticated || !selectedYear || !selectedTopic) {
      setResources([]);
      return;
    }

    const q = query(
      collection(db, 'resources'),
      where('year', '==', selectedYear),
      where('topic', '==', selectedTopic)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      setResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setExpandedResource(null);
    });

    return () => unsubscribe();
  }, [selectedYear, selectedTopic, authenticated]);

  const toggleResource = id => setExpandedResource(expandedResource === id ? null : id);

  // Password gate
  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50">
        <div className="p-6 bg-white rounded-2xl shadow-lg w-80">
          <h1 className="text-xl font-bold mb-4 text-center text-orange-700">Enter Password</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={enteredPassword}
              onChange={e => setEnteredPassword(e.target.value)}
              placeholder="Password"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-orange-400"
            />
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg py-2"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-orange-100 to-orange-50 min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-orange-800">Resources</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Year selector */}
        <div className="mb-8">
          <label htmlFor="year-select" className="block text-lg font-medium text-orange-700 mb-2">Select Year:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">-- Select a year --</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Topic selector */}
        {selectedYear && (
          <div className="mb-8">
            <label htmlFor="topic-select" className="block text-lg font-medium text-orange-700 mb-2">Select Topic:</label>
            <select
              id="topic-select"
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">-- Select a topic --</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        )}

        {/* Resource list */}
        {resources.length > 0 ? (
          <div className="space-y-6">
            {resources.map(res => (
              <div key={res.id} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-orange-800 mb-2">{res.title || res.topic}</h2>
                <button
                  onClick={() => window.open(res.resourceUrl, '_blank')}
                  className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  Open Resource
                </button>
                {expandedResource === res.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-700">{res.description || 'No additional details.'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : selectedTopic ? (
          <p className="text-center text-gray-600">No resources found for this topic.</p>
        ) : (
          <p className="text-center text-gray-600">
            {selectedYear ? 'Please select a topic to view resources.' : 'Please select a year first.'}
          </p>
        )}
      </div>
    </div>
  );
}

export default Resources;
