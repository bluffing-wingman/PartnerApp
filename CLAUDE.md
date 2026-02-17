## **Context Note**

### **0\. Design references are available in the folder design\_references with filenames giving reference for different items. The app is made in flutter but we can make a prototype in a simple mobile web app for the purpose of sign off.** 

### **1\. User Persona (Partner / Rohit)**

* User is a field technician (partner).  
* Responsible for installing Wiom connections.  
* Executes system-assigned bookings.  
* Performs ISP recharge (30 days, 100 Mbps) during setup.  
* Collects ₹300 security fee (only allowed payment).  
* Must follow strict compliance rules (no extra charges, no refusal of assigned installs).  
* Works in semi-structured field environment where rule deviation risk exists (cash collection, selective installs, misinformation).

This user is operational, not strategic. Quiz must validate behavioural compliance, not theory.

---

### **2\. PayG System Summary (Operational View)**

PayG \= Pay As You Go internet model.

Customer Side:

* Can recharge for any number of days (1, 7, 28, etc.).  
* Internet auto-pauses when recharge ends.  
* Setup includes:  
  * 30-day ISP recharge by partner.  
  * Customer receives 2 days initial internet.  
* Customer pays only ₹300 security fee.  
* No additional payment allowed.  
* No cash collection allowed.  
* If customer wants to pay in cash:  
  * Must use QR → someone else makes UPI payment.  
  * Partner cannot collect cash directly.

Security fee is refundable on device return.

Partner Economics:

* ₹300 payout for every successful install (PayG rule).  
* ₹300 fixed payout when 30-day ISP recharge is done.  
* Customer recharge behaviour does NOT affect partner payout.  
* Device bonus and rating bonus remain unchanged.  
* No new joining fee for PayG.

Compliance Rules:

* Installation of system-assigned connections is mandatory.  
* Recharge must activate internet immediately.  
* No selective refusal of customers.  
* No extra payment beyond ₹300.

---

### **3\. Objective of the Quiz**

Primary Objective:  
Validate that partner fully understands and agrees to operational and financial rules of PayG.

Secondary Objectives:

* Prevent unauthorized cash collection.  
* Prevent extra fee charging.  
* Prevent selective install refusal.  
* Reinforce ₹300-only rule.  
* Reinforce fixed payout understanding.  
* Ensure clarity on recharge → immediate activation behaviour.

The quiz is not informational.  
It is a compliance validation checkpoint before enabling PayG operations.

The system may:

* Gate feature access until quiz is passed.  
* Log partner acknowledgment.  
* Use incorrect answers as signals of risk.

---

This gives the coding agent clarity on:

* Who the user is  
* What PayG enforces  
* Why the quiz exists  
* What behaviour risk it is designed to control

