import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

console.log("Questions.jsx is being rendered");

const LOCAL_KEY = 'sams_authenticated'; // localStorage key
const CORRECT_PASSWORD = 'SAMS354790';

function Questions() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [enteredPassword, setEnteredPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Check localStorage to remember login
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored === 'true') {
      setAuthenticated(true);
    }
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
    setSelectedYear('');
    setTopics([]);
    setSelectedTopic('');
    setQuestions([]);
    setExpandedQuestion(null);
    setRevealedAnswers({});
    setSelectedAnswers({});
  };

  // Fetch years in real-time once authenticated
  useEffect(() => {
    if (!authenticated) return;

    const q = collection(db, 'questions');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const uniqueYears = new Set();
      snapshot.forEach((doc) => {
        const data = doc.data() || {};
        if (data.year) uniqueYears.add(data.year);
      });
      setYears(Array.from(uniqueYears).sort());
    }, (err) => {
      console.error('Failed to fetch years:', err);
    });

    return () => unsubscribe();
  }, [authenticated]);

  // Fetch topics based on selected year
  useEffect(() => {
    if (!authenticated || !selectedYear) {
      setTopics([]);
      setSelectedTopic('');
      return;
    }

    const q = query(
      collection(db, 'questions'),
      where('year', '==', selectedYear)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const uniqueTopics = new Set();
      snapshot.forEach((doc) => {
        const data = doc.data() || {};
        if (data.topic) uniqueTopics.add(data.topic);
      });
      setTopics(Array.from(uniqueTopics));
    }, (err) => {
      console.error('Failed to fetch topics:', err);
    });

    return () => unsubscribe();
  }, [selectedYear, authenticated]);

  // Fetch questions for selected year + topic
  useEffect(() => {
    if (!authenticated || !selectedYear || !selectedTopic) return;

    const q = query(
      collection(db, 'questions'),
      where('year', '==', selectedYear),
      where('topic', '==', selectedTopic)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const questionsData = [];
      snapshot.forEach((doc) => {
        questionsData.push({ id: doc.id, ...doc.data() });
      });
      setQuestions(questionsData);
      setExpandedQuestion(null);
      setRevealedAnswers({});
      setSelectedAnswers({});
    }, (err) => {
      console.error('Failed to fetch questions:', err);
    });

    return () => unsubscribe();
  }, [selectedYear, selectedTopic, authenticated]);

  const toggleExplanation = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
    setRevealedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleOptionClick = (questionId, index) => {
    if (selectedAnswers[questionId] !== undefined) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: index,
    }));

    setRevealedAnswers(prev => ({
      ...prev,
      [questionId]: true,
    }));
  };

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50">
        <div className="p-6 bg-white rounded-2xl shadow-lg w-80">
          <h1 className="text-xl font-bold mb-4 text-center text-orange-700">
            Enter Password
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
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
          <p className="text-xs text-center mt-3 text-gray-500">Enter the shared access password.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-b from-orange-100 to-orange-50 min-h-screen py-12 px-6 md:px-12'>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-orange-800">Questions</h1>
          <div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Year Selector */}
        <div className="mb-4">
          <label htmlFor="year-select" className="block text-lg font-medium text-orange-700 mb-2">
            Select Year:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">-- Select a year --</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Topic Selector */}
        {selectedYear && (
          <div className="mb-8">
            <label htmlFor="topic-select" className="block text-lg font-medium text-orange-700 mb-2">
              Select a Topic:
            </label>
            <select
              id="topic-select"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">-- Select a topic --</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Questions */}
        {questions.length > 0 ? (
          <div className="space-y-6">
            {questions.map((question) => {
              const questionImage = question.questionImageUrl || question.questionImage || question.imageUrl || null;
              const explanationImage = question.explanationImageUrl || question.explanationImage || null;
              const correctIndex = (question.correctAnswer ?? question.answer);
              return (
                <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-orange-800 mb-4">{question.title || question.question || 'Untitled'}</h2>

                  {questionImage && (
                    <div className="mb-4">
                      <img
                        src={questionImage}
                        alt="Question illustration"
                        className="max-w-full h-auto rounded-md"
                      />
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    {question.options && question.options.map((option, index) => {
                      const optionText = typeof option === 'string' ? option : (option.text ?? '');
                      const isSelected = selectedAnswers[question.id] === index;
                      const isCorrect = correctIndex === index;
                      const hasAnswered = selectedAnswers[question.id] !== undefined;

                      let classes = 'w-full text-left p-3 border rounded-md transition-colors cursor-pointer ';
                      if (hasAnswered) {
                        if (isSelected && isCorrect) classes += 'border-green-500 bg-green-100';
                        else if (isSelected && !isCorrect) classes += 'border-red-500 bg-red-100';
                        else if (isCorrect) classes += 'border-green-300 bg-green-50';
                        else classes += 'border-gray-200';
                      } else {
                        classes += 'border-gray-200 hover:bg-orange-50';
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(question.id, index)}
                          className={classes}
                        >
                          {String.fromCharCode(65 + index)}. {optionText}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => toggleExplanation(question.id)}
                    className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    {expandedQuestion === question.id ? 'Hide Explanation' : 'Show Explanation'}
                  </button>

                  {expandedQuestion === question.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                      <h3 className="font-medium text-gray-800 mb-2">Explanation:</h3>
                      <p className="text-gray-700 mb-3">{question.explanation}</p>

                      {explanationImage && (
                        <img
                          src={explanationImage}
                          alt="Explanation illustration"
                          className="max-w-full h-auto rounded-md"
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : selectedTopic ? (
          <p className="text-center text-gray-600">No questions found for this topic.</p>
        ) : (
          <p className="text-center text-gray-600">Please select a year and topic to view questions.</p>
        )}
      </div>
    </div>
  );
}

export default Questions;
