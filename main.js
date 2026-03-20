// ── Theme ──────────────────────────────────────────────────
window.toggleTheme = function() {
  var html  = document.documentElement;
  var isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeThumb').textContent = isDark ? '☀️' : '🌙';
};

// ── Page router ────────────────────────────────────────────
window.showPage = function(name) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  var pg = document.getElementById('page-' + name);
  if (pg) pg.classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('active'); });
  var nav = document.getElementById('nav-' + name);
  if (nav) nav.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('burger').classList.remove('open');
  setTimeout(runFI, 80);
};

// ── Burger ─────────────────────────────────────────────────
document.getElementById('burger').addEventListener('click', function() {
  this.classList.toggle('open');
  document.getElementById('navLinks').classList.toggle('open');
});

// ── Navbar scroll ──────────────────────────────────────────
window.addEventListener('scroll', function() {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 24);
  runFI();
});

// ── Fade-ins ───────────────────────────────────────────────
function runFI() {
  document.querySelectorAll('.fi:not(.on)').forEach(function(el) {
    if (el.getBoundingClientRect().top < window.innerHeight - 36) el.classList.add('on');
  });
}
runFI();

// ── Accordion ─────────────────────────────────────────────
window.toggleAcc = function(header) {
  var item   = header.parentElement;
  var isOpen = item.classList.contains('open');
  item.parentElement.querySelectorAll('.ai').forEach(function(s) { s.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
};

// ── Quiz ───────────────────────────────────────────────────
var QS = [
  { q:"What does 'phishing' refer to in cybersecurity?", opts:["Scanning a network for open ports","Tricking people into revealing sensitive info via fake emails or websites","A type of firewall configuration","Encrypting files with a key"], ans:1, exp:"Phishing is a social engineering attack where criminals impersonate trusted entities to steal credentials or personal data." },
  { q:"What is ransomware?", opts:["Software that monitors your browsing","A firewall blocking connections","Malware that encrypts files and demands payment","A tool for managing passwords"], ans:2, exp:"Ransomware encrypts your files and demands a ransom — usually in cryptocurrency — to restore access." },
  { q:"Which of the following is the STRONGEST password?", opts:["password123","John1990","T!9#mX@qL2&v","qwerty"], ans:2, exp:"T!9#mX@qL2&v is strong because it uses 12+ characters, uppercase, lowercase, numbers, and special characters." },
  { q:"What does 2FA add to your login?", opts:["A longer password requirement","A second verification step beyond your password","An encrypted connection","Automatic logout after 5 minutes"], ans:1, exp:"2FA requires a second proof of identity — like a phone code — so a stolen password alone can't access your account." },
  { q:"What is a DDoS attack?", opts:["Downloading dangerous software","Stealing database records","Flooding a server with traffic to make it unavailable","Cracking encrypted passwords"], ans:2, exp:"A Distributed Denial of Service attack overwhelms a target with traffic from thousands of sources, taking it offline." },
  { q:"Which protocol indicates an encrypted website connection?", opts:["HTTP","FTP","HTTPS","SMTP"], ans:2, exp:"HTTPS uses TLS/SSL encryption to protect data between your browser and the website." },
  { q:"What is 'social engineering' in cybersecurity?", opts:["Building social networks securely","Manipulating people psychologically to gain unauthorized access","Encrypting social media messages","Creating strong community passwords"], ans:1, exp:"Social engineering exploits human psychology — trust, fear, urgency — rather than technical vulnerabilities." },
  { q:"What does the 3-2-1 backup rule recommend?", opts:["Back up 3 files, 2x per week, 1 month history","3 copies on 2 different media with 1 stored offsite","3 passwords, 2 devices, 1 email","Back up every 3 days"], ans:1, exp:"3-2-1: 3 copies of data, on 2 different storage types, with 1 copy stored offsite (e.g. cloud)." },
  { q:"What is a botnet?", opts:["A secure business network","A malware-scanning robot","A network of compromised computers controlled by an attacker","An antivirus system"], ans:2, exp:"A botnet is a collection of infected devices controlled remotely by an attacker, often used for DDoS attacks or spam." },
  { q:"Best practice when using public Wi-Fi?", opts:["Use banking apps normally","Use a VPN to encrypt your traffic","Share your home Wi-Fi password","Disable your firewall for speed"], ans:1, exp:"A VPN encrypts your internet traffic on public Wi-Fi, preventing attackers from intercepting your data." }
];
var curQ = 0, score = 0, answered = false;

function loadQ() {
  var q = QS[curQ];
  document.getElementById('qNum').textContent   = 'QUESTION ' + (curQ+1) + ' / ' + QS.length;
  document.getElementById('qText').textContent  = q.q;
  document.getElementById('qProgress').style.width = ((curQ+1)/QS.length*100) + '%';
  document.getElementById('qScore').textContent = 'Score: ' + score;
  var opts = document.getElementById('qOpts');
  opts.innerHTML = '';
  q.opts.forEach(function(o, i) {
    var btn = document.createElement('button');
    btn.className = 'qopt';
    btn.innerHTML = '<span class="qltr">' + String.fromCharCode(65+i) + '</span>' + o;
    btn.onclick = function() { selectAns(i, btn); };
    opts.appendChild(btn);
  });
  document.getElementById('qFeedback').className = 'qfb';
  document.getElementById('qFeedback').textContent = '';
  document.getElementById('qNextBtn').style.display = 'none';
  answered = false;
}

function selectAns(idx, btn) {
  if (answered) return;
  answered = true;
  var q = QS[curQ];
  document.querySelectorAll('.qopt').forEach(function(o) { o.classList.add('disabled'); });
  var fb = document.getElementById('qFeedback');
  if (idx === q.ans) {
    btn.classList.add('correct');
    score++;
    document.getElementById('qScore').textContent = 'Score: ' + score;
    fb.className = 'qfb ok show';
    fb.textContent = '\u2713 Correct! ' + q.exp;
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.qopt')[q.ans].classList.add('correct');
    fb.className = 'qfb bad show';
    fb.textContent = '\u2717 Not quite. ' + q.exp;
  }
  document.getElementById('qNextBtn').style.display = 'flex';
}

window.nextQuestion = function() {
  curQ++;
  if (curQ >= QS.length) {
    document.getElementById('quizBody').style.display = 'none';
    document.getElementById('quizResult').classList.add('show');
    document.getElementById('rScore').textContent = score + '/' + QS.length;
    var pct = score / QS.length;
    document.getElementById('rMsg').textContent =
      pct >= .9 ? "Trophy Outstanding! You're a cybersecurity expert." :
      pct >= .7 ? 'Great job! Solid grasp of the fundamentals.' :
      pct >= .5 ? 'Good effort! Review the sections you missed.' :
                  'Keep learning - explore the site and try again.';
  } else { loadQ(); }
};

window.restartQuiz = function() {
  curQ = 0; score = 0; answered = false;
  document.getElementById('quizBody').style.display = 'block';
  document.getElementById('quizResult').classList.remove('show');
  loadQ();
};
loadQ();

// ── Password checker ───────────────────────────────────────
var COMMON = ['password','123456','qwerty','abc123','letmein','monkey','master','welcome','admin','login','iloveyou','sunshine','princess','dragon'];

window.checkPassword = function(val) {
  var checks = {
    'c-len': val.length >= 12,
    'c-up':  /[A-Z]/.test(val),
    'c-lo':  /[a-z]/.test(val),
    'c-num': /[0-9]/.test(val),
    'c-sym': /[^A-Za-z0-9]/.test(val),
    'c-com': val.length > 0 && !COMMON.includes(val.toLowerCase())
  };
  Object.keys(checks).forEach(function(id) {
    document.getElementById(id).classList.toggle('met', checks[id]);
  });
  var count  = Object.values(checks).filter(Boolean).length;
  var fill   = document.getElementById('pwFill');
  var lbl    = document.getElementById('pwLbl');
  if (!val) {
    fill.style.width = '0%'; fill.style.background = '';
    lbl.textContent  = 'Enter a password to check its strength';
    lbl.style.color  = 'var(--text-dim)'; return;
  }
  var levels = [
    [2,  '20%', 'var(--red)',   'Very Weak - crackable almost instantly'],
    [3,  '40%', '#e07830',     'Weak - could be cracked in minutes to hours'],
    [4,  '60%', 'var(--amber)', 'Fair - getting better, but still improvable'],
    [5,  '80%', '#7ec850',     'Strong - one step away from excellent'],
    [99, '100%','var(--green)', 'Excellent - this is a very strong password!']
  ];
  var level = levels.find(function(l) { return count <= l[0]; });
  fill.style.width = level[1]; fill.style.background = level[2];
  lbl.textContent  = level[3]; lbl.style.color = level[2];
};

window.togglePw = function() {
  var inp = document.getElementById('pwIn');
  var tog = document.getElementById('pwTog');
  inp.type        = inp.type === 'password' ? 'text' : 'password';
  tog.textContent = inp.type === 'password' ? '\ud83d\udc41' : '\ud83d\ude48';
};

// ── Phishing Simulator ────────────────────────────────────
var PS_EMAILS = [
  {
    isPhish: true,
    from: 'security-alert@paypa1-support.com',
    fromName: 'PayPal Security Team',
    to: 'you@email.com',
    subject: 'Urgent: Your PayPal Account Has Been Suspended',
    date: 'Today, 9:14 AM',
    bodyHtml: '<p>Dear Valued Customer,</p><p>We have detected <span class="phish-hi" title="Vague threat with no specifics">unusual activity on your account</span>. Your account has been <strong>temporarily suspended</strong> for your protection.</p><p>To restore access, you must verify your information within <span class="phish-hi" title="Artificial urgency - a classic phishing tactic">24 hours or your account will be permanently closed</span>.</p><p>Click below to verify your account immediately:<br/><span class="phish-link danger">http://paypa1-secure-login.xyz/verify?id=38821</span></p><p>Thank you for your cooperation.<br/>PayPal Security Team</p>',
    explanation: 'This is a phishing email impersonating PayPal to steal your login credentials.',
    flags: [
      { type:'red', icon:'&#128308;', label:'Fake sender domain', desc:'The address is <strong>paypa1-support.com</strong> — note the "1" instead of "l". PayPal only sends from @paypal.com.' },
      { type:'red', icon:'&#128308;', label:'Urgent threat language', desc:'Phrases like "account will be permanently closed" create panic to bypass your critical thinking.' },
      { type:'red', icon:'&#128308;', label:'Suspicious URL', desc:'<strong>paypa1-secure-login.xyz</strong> is not PayPal\'s domain. The .xyz extension and hyphens are red flags.' },
      { type:'red', icon:'&#128308;', label:'Vague threat with no specifics', desc:'Real companies describe the specific activity detected, not just "unusual activity".' }
    ]
  },
  {
    isPhish: false,
    from: 'noreply@github.com',
    fromName: 'GitHub',
    to: 'you@email.com',
    subject: '[GitHub] Please verify your email address',
    date: 'Today, 11:02 AM',
    bodyHtml: '<p>Hi there,</p><p>You recently created a GitHub account. To complete your registration, please verify your email address by clicking the link below:</p><p><span class="phish-link">https://github.com/users/verify-email?token=a8f3b2c1d9e0</span></p><p>This link will expire in 24 hours. If you did not create a GitHub account, you can safely ignore this email.</p><p>Thanks,<br/>The GitHub Team</p><p style="font-size:.8rem;color:var(--text-dim)">GitHub, Inc. 88 Colin P Kelly Jr Street San Francisco, CA 94107</p>',
    explanation: 'This is a legitimate email from GitHub sent during account registration.',
    flags: [
      { type:'green', icon:'&#9989;', label:'Authentic sender domain', desc:'Email comes from <strong>@github.com</strong> — GitHub\'s real domain. No typos, no suspicious subdomains.' },
      { type:'green', icon:'&#9989;', label:'No urgency or threats', desc:'Simply states the link expires in 24 hours — standard and reasonable. No threats.' },
      { type:'green', icon:'&#9989;', label:'Real GitHub URL', desc:'The verification link goes to <strong>github.com</strong> — no redirects, no misspellings.' },
      { type:'green', icon:'&#9989;', label:'Safe opt-out provided', desc:'It says to ignore the email if you did not sign up — a sign of a legitimate, trustworthy sender.' }
    ]
  },
  {
    isPhish: true,
    from: 'hr-department@yourcompany-payroll.net',
    fromName: 'HR Department',
    to: 'employee@yourcompany.com',
    subject: 'Action Required: Update Your Direct Deposit Information',
    date: 'Yesterday, 4:47 PM',
    bodyHtml: '<p>Dear Employee,</p><p>Our payroll system has been upgraded and <span class="phish-hi" title="Pretexting - a made-up reason to justify the request">all employees must re-enter their banking details</span> before the next pay cycle.</p><p><span class="phish-hi" title="Threatening financial loss to force compliance">Failure to update your information by Friday will result in delayed or missed payment.</span></p><p>Please submit your bank account number, routing number, and Social Security Number through the secure portal:</p><p><span class="phish-link danger">http://yourcompany-payroll.net/portal/update</span></p><p>Regards,<br/>Human Resources</p>',
    explanation: 'This is a business email compromise (BEC) attack targeting employees banking and personal information.',
    flags: [
      { type:'red', icon:'&#128308;', label:'External domain impersonating HR', desc:'Real HR emails from <strong>@yourcompany.com</strong>, not <strong>@yourcompany-payroll.net</strong> — a domain attackers registered.' },
      { type:'red', icon:'&#128308;', label:'Requesting SSN and banking details', desc:'Legitimate HR systems already have your banking info. They never ask you to re-enter your SSN via email.' },
      { type:'red', icon:'&#128308;', label:'Financial threat to force compliance', desc:'"Delayed or missed payment" is designed to make you act without thinking.' },
      { type:'red', icon:'&#128308;', label:'Made-up justification', desc:'"System upgrade" is a common pretext to explain why your information is suddenly needed again.' }
    ]
  },
  {
    isPhish: false,
    from: 'no-reply@accounts.google.com',
    fromName: 'Google',
    to: 'you@gmail.com',
    subject: 'Security alert: New sign-in from Chrome on Windows',
    date: 'Today, 8:33 AM',
    bodyHtml: '<p>Hi,</p><p>Your Google Account was just signed in to from a new Windows device.</p><p><strong>Device:</strong> Chrome on Windows 11<br/><strong>Location:</strong> Manila, Philippines<br/><strong>Time:</strong> March 11, 2026, 8:31 AM PHT</p><p>If this was you, you do not need to do anything.</p><p>If you do not recognize this sign-in, review your account activity and change your password at <span class="phish-link">https://myaccount.google.com/security</span></p><p>The Google Account Team</p>',
    explanation: 'This is a genuine Google security notification sent when a new device signs in to your account.',
    flags: [
      { type:'green', icon:'&#9989;', label:'Legitimate Google domain', desc:'Email from <strong>accounts.google.com</strong> — Google\'s actual accounts domain, not a lookalike.' },
      { type:'green', icon:'&#9989;', label:'Specific, verifiable details', desc:'Includes device type, location, and exact time — information a phisher would not know.' },
      { type:'green', icon:'&#9989;', label:'No urgency if action is not needed', desc:'Explicitly says "you do not need to do anything" if the login was yours.' },
      { type:'green', icon:'&#9989;', label:'Links to real Google domain', desc:'The link goes to <strong>myaccount.google.com</strong> — Google\'s genuine security page.' }
    ]
  },
  {
    isPhish: true,
    from: 'prize-winner@amazzon-rewards.com',
    fromName: 'Amazon Customer Rewards',
    to: 'you@email.com',
    subject: 'Congratulations! You have been selected for a $1,000 Amazon Gift Card',
    date: 'Today, 7:02 AM',
    bodyHtml: '<p>Dear Lucky Customer,</p><p><span class="phish-hi" title="Too-good-to-be-true offer - a hallmark of scams">You have been randomly selected as the winner of our monthly customer appreciation prize: a $1,000 Amazon Gift Card!</span></p><p>To claim your prize, you must complete the following steps within 48 hours:</p><p>1. Confirm your full name and home address<br/>2. Provide your credit card number for shipping verification<br/>3. Pay a <span class="phish-hi" title="Legitimate prizes never require upfront fees">$4.99 processing fee</span> to release your gift card</p><p>Claim your prize here: <span class="phish-link danger">http://amazzon-rewards.com/claim?id=winner8812</span></p><p>Amazon Rewards Team</p>',
    explanation: 'This is a classic prize scam designed to steal personal information and payment card details.',
    flags: [
      { type:'red', icon:'&#128308;', label:'Typo-squatted domain', desc:'<strong>amazzon-rewards.com</strong> has a double "z" — Amazon\'s real domain is amazon.com.' },
      { type:'red', icon:'&#128308;', label:'Unsolicited prize offer', desc:'You cannot win a contest you never entered. Unsolicited prize notifications are almost always scams.' },
      { type:'red', icon:'&#128308;', label:'Requests credit card for a fee', desc:'Legitimate prizes are never conditional on paying an upfront fee. This is an advance-fee scam.' },
      { type:'red', icon:'&#128308;', label:'Requests home address and personal info', desc:'Combined with a credit card request, this is a comprehensive identity theft attempt.' }
    ]
  },
  {
    isPhish: false,
    from: 'support@spotify.com',
    fromName: 'Spotify',
    to: 'you@email.com',
    subject: 'Your Spotify receipt - March 2026',
    date: 'March 1, 2026',
    bodyHtml: '<p>Hi there,</p><p>Here is your receipt for your Spotify Premium subscription.</p><p><strong>Date:</strong> March 1, 2026<br/><strong>Description:</strong> Spotify Premium Individual - Monthly<br/><strong>Amount:</strong> $9.99 USD<br/><strong>Payment method:</strong> Visa ending in 4821</p><p>Your subscription will renew automatically on April 1, 2026.</p><p>To manage your subscription, visit your account page at <span class="phish-link">https://www.spotify.com/account</span></p><p>Thanks for being a Premium member.<br/>The Spotify Team</p>',
    explanation: 'This is a legitimate Spotify billing receipt sent after a monthly subscription renewal.',
    flags: [
      { type:'green', icon:'&#9989;', label:'Official Spotify domain', desc:'Sent from <strong>@spotify.com</strong> — Spotify\'s real domain. The support subdomain is standard.' },
      { type:'green', icon:'&#9989;', label:'Matches expected billing cycle', desc:'Monthly subscription receipts on the 1st of the month are normal and expected.' },
      { type:'green', icon:'&#9989;', label:'Only last 4 digits of card shown', desc:'Legitimate receipts never show full card numbers — only the last 4 digits for reference.' },
      { type:'green', icon:'&#9989;', label:'Links to real Spotify domain', desc:'The account management link goes to <strong>spotify.com</strong> — the official domain.' }
    ]
  },
  {
    isPhish: true,
    from: 'itdesk@micros0ft-support.org',
    fromName: 'Microsoft IT Support',
    to: 'you@company.com',
    subject: 'IMPORTANT: Your Microsoft 365 License Expires Tonight',
    date: 'Today, 2:11 PM',
    bodyHtml: '<p>Dear User,</p><p><span class="phish-hi" title="False urgency - designed to create panic">Your Microsoft 365 license will expire at midnight tonight</span>. After this time, you will lose access to all Microsoft services including Outlook, Teams, and OneDrive.</p><p>To renew and avoid service interruption, click the link below and enter your <span class="phish-hi" title="Microsoft will never ask for your password via email">Microsoft credentials and payment information</span>:</p><p><span class="phish-link danger">http://micros0ft-support.org/renew365?urgent=true</span></p><p>If you have questions, call our support line at +1-888-555-0192.</p><p>Microsoft Support Team</p>',
    explanation: 'This is a phishing attack impersonating Microsoft to steal account credentials and payment information.',
    flags: [
      { type:'red', icon:'&#128308;', label:'Domain uses zero instead of the letter o', desc:'<strong>micros0ft-support.org</strong> replaces "o" with "0". Real Microsoft emails come from @microsoft.com.' },
      { type:'red', icon:'&#128308;', label:'Midnight expiry creates panic', desc:'License expirations have multi-week warning cycles through official portals — never via one-hour deadlines.' },
      { type:'red', icon:'&#128308;', label:'Requests credentials AND payment together', desc:'Microsoft would never ask for both your password and payment info in the same email.' },
      { type:'red', icon:'&#128308;', label:'Fake support phone number', desc:'Scammers include phone numbers connecting to call centers designed to further compromise victims.' }
    ]
  },
  {
    isPhish: false,
    from: 'noreply@linkedin.com',
    fromName: 'LinkedIn',
    to: 'you@email.com',
    subject: 'Maria Santos accepted your connection request',
    date: 'Today, 3:22 PM',
    bodyHtml: '<p>Hi,</p><p><strong>Maria Santos</strong> accepted your connection request on LinkedIn.</p><p><strong>Maria Santos</strong><br/>Senior UX Designer at TechCorp Philippines<br/>500+ connections</p><p>Send Maria a message to start a conversation.</p><p>You may also know these people:<br/>- James Reyes, Product Manager at StartupMNL<br/>- Ana Cruz, Full Stack Developer</p><p>View your network at <span class="phish-link">https://www.linkedin.com/mynetwork</span></p><p>The LinkedIn Team</p>',
    explanation: 'This is a genuine LinkedIn connection notification — one of the most common types of LinkedIn emails.',
    flags: [
      { type:'green', icon:'&#9989;', label:'Sent from official linkedin.com domain', desc:'The sender is <strong>noreply@linkedin.com</strong> — LinkedIn\'s verified sending domain.' },
      { type:'green', icon:'&#9989;', label:'No personal data or credentials requested', desc:'Connection notifications never ask for passwords, payment, or personal information.' },
      { type:'green', icon:'&#9989;', label:'Consistent with expected app activity', desc:'If you recently sent a connection request, receiving this notification is normal and expected.' },
      { type:'green', icon:'&#9989;', label:'Links go to linkedin.com', desc:'All links point to <strong>linkedin.com</strong> — no redirects or lookalike domains.' }
    ]
  },
  {
    isPhish: true,
    from: 'verification@secure-bankofamerica.info',
    fromName: 'Bank of America Security',
    to: 'customer@email.com',
    subject: 'Account Verification Required - Suspicious Transaction Detected',
    date: 'Today, 6:49 AM',
    bodyHtml: '<p>Dear Bank of America Customer,</p><p>Our fraud detection system has flagged a <span class="phish-hi" title="Vague claim with no transaction details">suspicious transaction of $847.00</span> on your account. To prevent further unauthorized activity, your account has been limited.</p><p>To remove the limitation and confirm your identity, we need you to verify:</p><p>- <span class="phish-hi" title="Banks never request these via email">Full Social Security Number</span><br/>- Online banking username and password<br/>- Debit card number, expiry date, and CVV</p><p>Complete your verification at: <span class="phish-link danger">http://secure-bankofamerica.info/verify-account</span></p><p>Failure to verify within 12 hours will result in permanent account suspension.</p>',
    explanation: 'This is a bank impersonation phishing attack attempting to harvest financial credentials and identity documents.',
    flags: [
      { type:'red', icon:'&#128308;', label:'Not a real Bank of America domain', desc:'BoA emails come from @bankofamerica.com. <strong>secure-bankofamerica.info</strong> is a completely different domain attackers registered.' },
      { type:'red', icon:'&#128308;', label:'Requests SSN, password, and CVV', desc:'No legitimate bank will ever ask for your SSN, full banking password, or CVV via email — ever.' },
      { type:'red', icon:'&#128308;', label:'Vague transaction with no real details', desc:'Real fraud alerts include merchant name, location, and exact time — not just an amount.' },
      { type:'red', icon:'&#128308;', label:'Permanent suspension in 12 hours', desc:'Extreme urgency with account closure threats is a textbook phishing pressure tactic.' }
    ]
  },
  {
    isPhish: false,
    from: 'no-reply@dropbox.com',
    fromName: 'Dropbox',
    to: 'you@email.com',
    subject: 'Alex Rivera shared "Q1 Project Brief.pdf" with you',
    date: 'Today, 1:08 PM',
    bodyHtml: '<p>Hi,</p><p><strong>Alex Rivera</strong> (alex.rivera@workteam.com) shared a file with you on Dropbox.</p><p>Q1 Project Brief.pdf<br/>Shared with view access</p><p>View the file at: <span class="phish-link">https://www.dropbox.com/sh/a8b3f2c1/AACx7d9Lk</span></p><p>You will need a Dropbox account to access this file. If you do not have one, you can create a free account at dropbox.com.</p><p>The Dropbox Team</p><p style="font-size:.8rem;color:var(--text-dim)">Dropbox, Inc., 1800 Owens Street, San Francisco, CA 94158</p>',
    explanation: 'This is a legitimate Dropbox file-sharing notification from a known colleague.',
    flags: [
      { type:'green', icon:'&#9989;', label:'Official Dropbox sending domain', desc:'Sent from <strong>no-reply@dropbox.com</strong> — Dropbox\'s verified email domain.' },
      { type:'green', icon:'&#9989;', label:'Identifies the sharer by name and email', desc:'Includes the specific person\'s name and work email — making it verifiable.' },
      { type:'green', icon:'&#9989;', label:'Link points to dropbox.com', desc:'The shared file URL goes directly to <strong>dropbox.com</strong> with a standard share token.' },
      { type:'green', icon:'&#9989;', label:'No passwords or data requested', desc:'File-sharing notifications never ask for credentials — they only direct you to the platform.' }
    ]
  }
];

var psIndex = 0, psScore = 0, psAnswered = false;

function psRender() {
  var em = PS_EMAILS[psIndex];
  var card = document.getElementById('psEmailCard');
  card.className = 'email-card';
  document.getElementById('psCounter').textContent = 'EMAIL ' + (psIndex+1) + ' OF ' + PS_EMAILS.length;
  document.getElementById('psProgress').style.width = ((psIndex+1)/PS_EMAILS.length*100) + '%';
  document.getElementById('psScore').textContent = psScore;
  document.getElementById('psTotal').textContent = psIndex;
  document.getElementById('psEmailHeader').innerHTML =
    '<div class="email-field"><span class="ef-label">From</span><span class="ef-val"><strong>' + em.fromName + '</strong> &lt;' + em.from + '&gt;</span></div>' +
    '<div class="email-field"><span class="ef-label">To</span><span class="ef-val">' + em.to + '</span></div>' +
    '<div class="email-field"><span class="ef-label">Date</span><span class="ef-val">' + em.date + '</span></div>' +
    '<div class="email-field" style="margin-top:4px"><span class="ef-label" style="padding-top:2px">Subject</span><span class="ef-subject">' + em.subject + '</span></div>';
  document.getElementById('psEmailBody').innerHTML = em.bodyHtml;
  var fb = document.getElementById('psFeedback');
  fb.className = 'psim-feedback';
  fb.innerHTML = '';
  document.getElementById('psNextArea').style.display = 'none';
  document.getElementById('psBtnSafe').disabled = false;
  document.getElementById('psBtnPhish').disabled = false;
  psAnswered = false;
}

window.psAnswer = function(userSaysPhish) {
  if (psAnswered) return;
  psAnswered = true;
  var em = PS_EMAILS[psIndex];
  var correct = (userSaysPhish === em.isPhish);
  if (correct) psScore++;
  document.getElementById('psScore').textContent = psScore;
  document.getElementById('psTotal').textContent = psIndex + 1;
  document.getElementById('psBtnSafe').disabled = true;
  document.getElementById('psBtnPhish').disabled = true;
  var card = document.getElementById('psEmailCard');
  card.className = 'email-card ' + (em.isPhish ? 'revealed-phish' : 'revealed-safe');
  var fb = document.getElementById('psFeedback');
  var flagsHtml = em.flags.map(function(f) {
    return '<div class="fb-flag ' + f.type + '"><span class="fb-flag-ico">' + f.icon + '</span><div><strong>' + f.label + '</strong><br/>' + f.desc + '</div></div>';
  }).join('');
  var verdictLabel = correct ? '<span class="fb-badge badge-correct">Correct</span>' : '<span class="fb-badge badge-incorrect">Incorrect</span>';
  var verdictText = correct
    ? (em.isPhish ? 'Right — this is a phishing email!' : 'Right — this email is legitimate!')
    : (em.isPhish ? 'This was actually a phishing email.' : 'This was actually a safe, legitimate email.');
  fb.innerHTML =
    '<div class="fb-verdict">' + verdictLabel + '<span class="fb-verdict-text">' + verdictText + '</span></div>' +
    '<div class="fb-explanation">' + em.explanation + '</div>' +
    '<div class="fb-flags">' + flagsHtml + '</div>';
  fb.className = 'psim-feedback show ' + (correct ? 'correct' : 'incorrect');
  var nextArea = document.getElementById('psNextArea');
  nextArea.style.display = 'flex';
  document.getElementById('psNextBtn').textContent = (psIndex >= PS_EMAILS.length - 1) ? 'See Results \u2192' : 'Next Email \u2192';
};

window.psNext = function() {
  psIndex++;
  if (psIndex >= PS_EMAILS.length) {
    var wrap = document.getElementById('psimWrap');
    wrap.querySelector('.psim-scorebar').style.display = 'none';
    wrap.querySelector('.psim-progress-bar').style.display = 'none';
    document.getElementById('psEmailCard').style.display = 'none';
    wrap.querySelector('.psim-actions').style.display = 'none';
    document.getElementById('psFeedback').className = 'psim-feedback';
    document.getElementById('psNextArea').style.display = 'none';
    var wrong = PS_EMAILS.length - psScore;
    var pct   = Math.round(psScore / PS_EMAILS.length * 100);
    document.getElementById('prBig').textContent     = psScore + '/' + PS_EMAILS.length;
    document.getElementById('prCorrect').textContent = psScore;
    document.getElementById('prWrong').textContent   = wrong;
    document.getElementById('prPct').textContent     = pct + '%';
    document.getElementById('prMsg').textContent =
      pct === 100 ? "Perfect score! You're an expert at spotting phishing emails." :
      pct >= 80   ? "Excellent awareness! You caught most phishing attempts. Stay sharp." :
      pct >= 60   ? "Good effort — review the explanations to sharpen your instincts." :
                    "Keep practicing! Phishing emails are designed to be deceptive — learning takes time.";
    document.getElementById('psResult').classList.add('show');
  } else {
    psRender();
  }
};

window.psRestart = function() {
  psIndex = 0; psScore = 0; psAnswered = false;
  var wrap = document.getElementById('psimWrap');
  wrap.querySelector('.psim-scorebar').style.display = '';
  wrap.querySelector('.psim-progress-bar').style.display = '';
  document.getElementById('psEmailCard').style.display = '';
  wrap.querySelector('.psim-actions').style.display = '';
  document.getElementById('psResult').classList.remove('show');
  psRender();
};

psRender();