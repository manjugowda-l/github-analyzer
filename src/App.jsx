import { useState, useEffect } from "react";
import "./App.css";
/* ✅ ACCORDION (FIXED POSITION) */
const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`card ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="cardHeader" onClick={() => setOpen(!open)}>
        {title}
        <span className={`icon ${open ? "rotate" : ""}`}>
          {open ? "−" : "+"}
        </span>
      </div>

      {/* ALWAYS RENDER */}
      <div className="cardBody">
        {children}
      </div>
    </div>
  );
};
function App() {

  /* ================= BACKGROUND ================= */
  useEffect(() => {
    const canvas = document.getElementById("starCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width, height;
    let stars = [];
    let nebula = [];
    let meteors = [];
    let mouse = { x: 0, y: 0 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function handleMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    function createStars(count) {
      stars = [];
      for (let i = 0; i < count; i++) {
        const layer = Math.random();

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: layer * 2,
          speed: layer * 0.6 + 0.05,
          opacity: Math.random(),
          twinkle: Math.random() * 0.02,
          layer,
        });
      }
    }

    function createNebula() {
      nebula = [];
      for (let i = 0; i < 5; i++) {
        nebula.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 400 + 200,
          color:
            Math.random() > 0.5
              ? "rgba(108,92,231,0.08)"
              : "rgba(255,110,196,0.15)",
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
        });
      }
    }

    createStars(350);
    createNebula();

    function spawnMeteor() {
      meteors.push({
        x: Math.random() * width,
        y: 0,
        len: Math.random() * 80 + 50,
        speed: Math.random() * 8 + 4,
      });
    }

    const meteorInterval = setInterval(spawnMeteor, 2500);

    function animate() {
      ctx.clearRect(0, 0, width, height);

      nebula.forEach((n) => {
        const gradient = ctx.createRadialGradient(
          n.x,
          n.y,
          0,
          n.x,
          n.y,
          n.radius
        );

        gradient.addColorStop(0, n.color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.filter = "blur(60px)";
        ctx.fill();
        ctx.filter = "none";

        n.x += n.speedX;
        n.y += n.speedY;
      });

      stars.forEach((s) => {
        s.y += s.speed;

        const dx = (mouse.x - width / 2) * 0.0005 * s.layer;
        const dy = (mouse.y - height / 2) * 0.0005 * s.layer;

        s.x += dx;
        s.y += dy;

        if (s.y > height) s.y = 0;

        s.opacity += s.twinkle;
        if (s.opacity > 1 || s.opacity < 0.2) s.twinkle *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
      });

      meteors.forEach((m, i) => {
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.len, m.y + m.len);

        const grad = ctx.createLinearGradient(
          m.x,
          m.y,
          m.x - m.len,
          m.y + m.len
        );

        grad.addColorStop(0, "white");
        grad.addColorStop(1, "transparent");

        ctx.strokeStyle = grad;
        ctx.stroke();

        m.x += m.speed;
        m.y += m.speed;

        if (m.y > height) meteors.splice(i, 1);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(meteorInterval);
    };
  }, []);

  /* ================= STATES ================= */
  const [mode, setMode] = useState("");
  const [username, setUsername] = useState("");
  const [requirement, setRequirement] = useState("");
  const [recruiterAnalysis, setRecruiterAnalysis] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isSelf, setIsSelf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);

  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("loggedIn") === "true"
  );
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [showHistory, setShowHistory] = useState(false);
  
  const [authMode, setAuthMode] = useState("login");

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");
  /* ================= FETCH ================= */
  const fetchProfile = async () => {
    document.activeElement.blur();
    if (!username) return;
    setShowHistory(false);

    setLoading(true);

    try {
      const userRes = await fetch(
        `https://api.github.com/users/${username}`
      );
      const userData = await userRes.json();

      if (userData.message === "Not Found") {
        alert("User not found");
        setLoading(false);
        return;
      }

      setProfile(userData);

        const updatedHistory = [
          username,
          ...history.filter((item) => item !== username)
        ].slice(0, 5);

        setHistory(updatedHistory);

        localStorage.setItem(
          "history",
          JSON.stringify(updatedHistory)
        );

      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const repoData = await repoRes.json();

      setRepos(repoData.slice(0, 5));
      const langCount = {};
      repoData.forEach((r) => {
        if (r.language) {
          langCount[r.language] =
            (langCount[r.language] || 0) + 1;
        }
      });

      const aiInput = {
        bio: userData.bio,
        repoCount: repoData.length,
        topRepos: repoData.slice(0, 5).map(r => ({
          name: r.name,
          stars: r.stargazers_count,
          language: r.language,
          description: r.description
        })),
        languages: langCount,
        totalStars: repoData.reduce((sum, r) => sum + r.stargazers_count, 0)
      };

      let aiResult = null;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(aiInput)
        });

        const data = await res.json();

        if (data?.result) {
          aiResult = JSON.parse(data.result);
        }
      } catch (err) {
        console.log("AI failed, using fallback");
      }


      

      setAnalysis({
        sortedLangs: Object.entries(langCount).sort(
          (a, b) => b[1] - a[1]
        ),

        skills: {
          backend: Math.min(100, (langCount["Python"] || 0) * 20),
          frontend: Math.min(100, (langCount["JavaScript"] || 0) * 20),
          devops: Math.min(100, (langCount["Shell"] || 0) * 20),
        },

        developerType: aiResult?.developerType || "Unknown",

        insights: aiResult?.insights || [
          "Basic analysis (AI unavailable)"
        ],

        focus: aiResult?.focus || "No recommendation",

        summary: aiResult?.summary || "No summary available",
      });

    } catch (err) {
      console.error(err);
      alert("Error fetching data");
    }

    setLoading(false);
  };

  const analyzeCandidate = async () => {
    if (loading) return;
    if (!username || !requirement) return;
    setShowHistory(false);
    setLoading(true);

    try {
      const userRes = await fetch(
        `https://api.github.com/users/${username}`
      );

      const userData = await userRes.json();

      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos`
      );

      const repoData = await repoRes.json();

      const langCount = {};

      repoData.forEach((r) => {
        if (r.language) {
          langCount[r.language] =
            (langCount[r.language] || 0) + 1;
        }
      });

      const aiInput = {
        requirement,
        bio: userData.bio,
        repoCount: repoData.length,

        topRepos: repoData.slice(0, 5).map((r) => ({
          name: r.name,
          stars: r.stargazers_count,
          language: r.language,
          description: r.description,
        })),

        languages: langCount,
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/analyze-recruiter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(aiInput),
        }
      );

      const data = await res.json();

      setRecruiterAnalysis(data);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

    const handleSignup = () => {

      if (!signupUser || !signupPass) {
        alert("Fill all fields");
        return;
      }
      const existingUser =
        localStorage.getItem("gh_user");

      if (existingUser === signupUser) {
        alert("Account already exists");
        return;
      }
      localStorage.setItem("gh_user", signupUser);
      localStorage.setItem("gh_pass", signupPass);

      alert("Signup successful");

      setAuthMode("login");
    };
    const handleLogin = () => {

    const savedUser =
      localStorage.getItem("gh_user");

    const savedPass =
      localStorage.getItem("gh_pass");

    if (
      loginUser === savedUser &&
      loginPass === savedPass
    ) {

      sessionStorage.setItem("loggedIn", "true");

      setLoggedIn(true);

    } else {

      alert("Invalid credentials");
    }
  };
  /* ================= UI ================= */
if (!loggedIn) {

  return (

    <>
      <canvas id="starCanvas"></canvas>

      <div className="loginPage">

        <h1 className="title">
          GitHub Analyzer
        </h1>

        <div className="loginCard">

          {authMode === "signup" ? (

            <>

              <h2>Create Account</h2>

              <input
                className="input"
                placeholder="Create Username"
                value={signupUser}
                onChange={(e) =>
                  setSignupUser(e.target.value)
                }
              />

              <input
                className="input"
                type="password"
                placeholder="Create Password"
                value={signupPass}
                onChange={(e) =>
                  setSignupPass(e.target.value)
                
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSignup();
                  }
                }}
              />

              <button
                className="button"
                onClick={handleSignup}
              >
                Sign Up
              </button>

              <p
                className="switchText"
                onClick={() =>
                  setAuthMode("login")
                }
              >
                Already have account? Login
              </p>

            </>

          ) : (

            <>

              <h2>Login</h2>

              <input
                className="input"
                placeholder="Username"
                value={loginUser}
                onChange={(e) =>
                  setLoginUser(e.target.value)
                }

                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />

              <input
                className="input"
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={(e) =>
                  setLoginPass(e.target.value)
                }

                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
              />

              <button
                className="button"
                onClick={handleLogin}
              >
                Login
              </button>

              <p
                className="switchText"
                onClick={() =>
                  setAuthMode("signup")
                }
              >
                Create new account
              </p>

            </>

          )}
          

        </div>
      </div>
    </>
  );
}
 
  return (
  <>
    <canvas id="starCanvas"></canvas>

    <div className="container">
      <h1 className="title">GitHub Analyzer</h1>
      <button
          className="logoutBtn"
          onClick={() => {

            sessionStorage.removeItem("loggedIn");

            setLoggedIn(false);
          }}
        >
          ←  Logout
        </button>
      <div className="modeSwitch">
        
        <button
          className={mode === "developer" ? "activeMode" : "modeBtn"}
          onClick={() => setMode("developer")}
        >
          Developer Mode
        </button>

        <button
          className={mode === "recruiter" ? "activeMode" : "modeBtn"}
          onClick={() => setMode("recruiter")}
        >
          Recruiter Mode
        </button>
      </div>

      {mode === "developer" && (
        <>
          <div className="searchBox">

            <div className="inputWrapper">

              <input
                className="input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setShowHistory(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchProfile();
                }}
                placeholder="Enter GitHub username"
              />

              {showHistory && username &&
                history.filter((item) =>
                  item.toLowerCase().includes(username.toLowerCase())
                ).length > 0 && (

                <div className="historyBox">

                  {history
                    .filter((item) =>
                      item.toLowerCase().includes(username.toLowerCase())
                    )
                    .map((item, index) => (

                      <div
                        key={index}
                        className="historyItem"
                        onClick={() => {
                          setUsername(item);
                          setShowHistory(false);
                        }}
                      >
                        {item}
                      </div>

                    ))}

                </div>
              )}

            </div>

            <button className="button" onClick={fetchProfile}>
              Analyze
            </button>

            <button
              className="resetBtn"
              onClick={() => {
                setUsername("");
                setProfile(null);
                setRepos([]);
                setAnalysis(null);
                setIsSelf(false);
                setShowHistory(false);
              }}
            >
              ↻
            </button>

          </div>
       

          {loading && <p>Analyzing...</p>}

          

          <div className="userToggle">

            <button
              className={!isSelf ? "toggleActive" : "toggleBtn"}
              onClick={() => {
                setSwitching(true);

                setTimeout(() => {
                  setIsSelf(false);
                  setSwitching(false);
                }, 250);
              }}
            >
              Others
            </button>

            <button
              className={isSelf ? "toggleActive" : "toggleBtn"}
              onClick={() => {
                setSwitching(true);

                setTimeout(() => {
                  setIsSelf(true);
                  setSwitching(false);
                }, 250);
              }}
            >
              Me
            </button>

          </div>

          <div className="layout">
            {profile && (
              <div className="leftPanel">
                <img
                  src={profile.avatar_url}
                  className="avatarLarge"
                />

                <h2>{profile.name}</h2>

                <p>{profile.bio}</p>
              </div>
            )}

            <div className="rightPanel">
              {!switching && (
                <div className="fadeContent">
                  {/* 📊 LANGUAGES */}
                  {analysis?.sortedLangs && (
                    <Accordion title="📊 Languages">
                      <div className="langGraph">
                        {analysis.sortedLangs.map(([lang, count]) => {
                          const max =
                            analysis.sortedLangs?.[0]?.[1] || 1;

                          const percent =
                            (count / max) * 100;

                          return (
                            <div
                              key={lang}
                              className="langRow"
                            >
                              <span className="langName">
                                {lang}
                              </span>

                              <div className="langBarBg">
                                <div
                                  className="langBarFill"
                                  style={{
                                    width: `${percent}%`,
                                  }}
                                ></div>
                              </div>

                              <span className="langCount">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </Accordion>
                  )}

                  {/* ⭐ TOP PROJECTS */}
                  {repos.length > 0 && (
                    <Accordion title="⭐ Top Projects">
                      <div className="projectList">
                        {repos.map((r) => (
                          <div
                            key={r.id}
                            className="projectRow"
                          >
                            <span className="projectName">
                              {r.name}
                            </span>

                            <span className="projectStars">
                              ⭐ {r.stargazers_count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Accordion>
                  )}

                  {/* 🧠 SKILL LEVEL */}
                  {analysis && (
                    <Accordion title="🧠 Skill Level">
                      <div className="skillBlock">

                        <div className="skillRow">
                          <span>Backend</span>

                          <div className="skillBar">
                            <div
                              style={{
                                width: `${analysis.skills?.backend || 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="skillRow">
                          <span>Frontend</span>

                          <div className="skillBar">
                            <div
                              style={{
                                width: `${analysis.skills?.frontend || 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="skillRow">
                          <span>DevOps</span>

                          <div className="skillBar">
                            <div
                              style={{
                                width: `${analysis.skills?.devops || 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                      </div>
                    </Accordion>
                  )}

                  {/* 👨‍💻 DEV TYPE */}
                  {!isSelf && analysis && (
                    <Accordion title="👨‍💻 Developer Type">
                      <p className="simpleText">
                        {analysis.developerType}
                      </p>
                    </Accordion>
                  )}

                  {/* 💡 INSIGHTS */}
                  {analysis && (
                    <Accordion title="💡 Insights">
                      <ul className="list">
                        {analysis.insights?.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))}
                      </ul>
                    </Accordion>
                  )}

                  {/* 📝 SUMMARY */}
                  {analysis && (
                    <Accordion title="📝 Summary">
                      <p className="simpleText">
                        {analysis.summary}
                      </p>
                    </Accordion>
                  )}

                  {/* 🚀 FOCUS */}
                  {isSelf && analysis && (
                    <Accordion title="🚀 Focus Recommendation">
                      <p className="simpleText">
                        {analysis.focus}
                      </p>
                    </Accordion>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {mode === "recruiter" && (

        !recruiterAnalysis ? (

          <div className="searchBox">

            <div className="inputWrapper">

              <input
                className="input"
                value={username}
                onChange={(e) => {
                setUsername(e.target.value);
                setShowHistory(true);
              }}
                placeholder="Enter GitHub username"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    analyzeCandidate();
                  }
                }}
              />

              {showHistory && username &&
                history.filter((item) =>
                  item.toLowerCase().includes(username.toLowerCase())
                ).length > 0 && (

                <div className="historyBox">

                  {history
                    .filter((item) =>
                      item.toLowerCase().includes(username.toLowerCase())
                    )
                    .map((item, index) => (

                      <div
                        key={index}
                        className="historyItem"
                        onClick={() => {
                          setUsername(item);
                          setShowHistory(false);
                        }}
                      >
                        {item}
                      </div>

                    ))}

                </div>
              )}

            </div>

            <textarea
              className="inputreq"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Enter recruiter requirements"

              onKeyDown={(e) => {

                if (e.key === "Enter" && !e.ctrlKey) {
                  e.preventDefault();
                  analyzeCandidate();
                }

                if (e.key === "Enter" && e.ctrlKey) {
                  const start = e.target.selectionStart;
                  const end = e.target.selectionEnd;

                  const newValue =
                    requirement.substring(0, start) +
                    "\n" +
                    requirement.substring(end);

                  setRequirement(newValue);

                  setTimeout(() => {
                    e.target.selectionStart =
                      e.target.selectionEnd =
                      start + 1;
                  }, 0);
                }
              }}
            />

            <button
              className="button"
              onClick={analyzeCandidate}
            >
              Analyze Candidate
            </button>

          </div>

        ) : (

          <div className="card">

            <button
              className="backBtn"
              onClick={() => {
                setRecruiterAnalysis(null);
                setUsername("");
                setRequirement("");
              }}
            >
              ← Back
            </button>

            <div className="cardHeader">
              Recruiter Analysis
            </div>

            <div className="simpleText">
              {recruiterAnalysis.result
                .replace(/[{}"]/g, "")
                .replace("matchScore:", "🎯 MATCH SCORE: ")
                .replace("strengths:", "\n\n✅ STRENGTHS:\n")
                .replace("weaknesses:", "\n\n❌ WEAKNESSES:\n")
                .replace(/\[/g, "")
                .replace(/\]/g, "")
                .replace(/,\s*\n\s*❌/g, "\n\n❌")
                .replace(/,\s*$/g, "")}
            </div>
          </div>

        )

      )}

        
    </div>
  </>
);
}
export default App;