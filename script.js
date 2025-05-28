
const CONTRACT_ADDRESS = "0x433b3bb6Bff1D6Ba75F857b3E6ED8508FF268c11";


const ABI =[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_emailId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_studentname",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_course",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_performance",
				"type": "string"
			}
		],
		"name": "add",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_emailId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_course",
				"type": "string"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
		;

let contract;
let signer;

async function connectWallet() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
     contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  
  } else {
    alert("Please install MetaMask!");
  }
}

// Issue certificate
async function issueCertificate() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const course = document.getElementById("course").value.trim();
  const performance = document.getElementById("performance").value.trim();

  try {
    if (!name || !email || !course || !performance) {
      alert("All fields are required.");
      return;
    }

    await connectWallet();
    const tx = await contract.add(email, name, course, performance);
    await tx.wait();
    alert("✅ Certificate issued successfully!");
  } catch (err) {
    console.error("❌ Blockchain Error:", err);
    const reason =
      err?.data?.message ||
      err?.error?.message ||
      err?.message ||
      "Unknown error";
    alert("❌ Error issuing certificate:\n" + reason);
  }
}

/*async function issueCertificate() {                                .................3
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const course = document.getElementById("course").value;
  const performance = document.getElementById("performance").value;

 /* try {                                                     .....................1
    await connectWallet();
    const tx = await contract.add(email,name, course, performance);
    await tx.wait();
    alert("Certificate issued successfully!");
  } catch (err) {
    alert("Error: " + err.message);
  }*/
/* try {
  await connectWallet();
  const tx = await contract.add(email, name, course, performance);
  await tx.wait();
  alert("Certificate issued successfully!");
} catch (err) {
  console.error("Blockchain Error:", err);
  alert("Error issuing certificate: " + (err.data?.message || err.message));                  ................2
}

}*/                                                               

// Verify certificate
async function verifyCertificate() {
  const email = document.getElementById("verifymail").value;
  const course = document.getElementById("verifycourse").value;

  try {
    await connectWallet();
    const result = await contract.verify(email, course);
    alert(`✅ Verified!\nName: ${result[0]}\nCourse: ${result[1]}\nPerformance: ${result[2]}`);
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Add button event listeners
window.onload = () => {
  document.getElementById("issuebtn").addEventListener("click", issueCertificate);
  document.getElementById("verifybtn").addEventListener("click", verifyCertificate);
};
