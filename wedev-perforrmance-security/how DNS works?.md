## How DNS works??
- What happens when you type https://website.com into your browser and press Enter? How do we get an IP address of a web page? 
- The Domain Name System (DNS) is essentially the phone book of the Internet. It translates human-friendly domain names (like www.example.com) into IP addresses (like 192.0.2.1) that computers use to identify each other on the network.
- The first thing that needs to be done is to translate this text-based domain into a machine-adapted numerical IP address. 
- This is the role of a DNS server, and it acts as a phonebook of the Internet.



![image](https://github.com/venkatdas/Interview_prep/assets/43024084/06678179-78a7-4fe7-884d-6d97771acb5c)



![image](https://github.com/venkatdas/Interview_prep/assets/43024084/2bb6d2aa-6093-4bf0-928f-4684d7d4b14c)

Here, How it works..

1) **Query Initiation:** When you type a web address into your browser, the browser first checks if the IP address for the domain is stored in its cache.
 If not, the request is sent to the DNS resolver.

2) **DNS Resolver:** The resolver, typically operated by your Internet Service Provider (ISP), queries the DNS hierarchy to find the IP address.
 If it doesn't have the address cached, it sends the query to the root name servers. 0R ( If the server is not found in the HOSTS file, when the users enter https://website.com into the browser, this request hits the DNS Resolver. This server interacts with other DNS servers to find the correct IP address.)

3) **Root Name Servers:** The root servers are the top of the DNS hierarchy. They don't know the IP address for the domain but can direct the query to the TLD (Top-Level Domain) servers based on the TLD of the domain (.com, .net, .org, etc.).
4) **TLD Name Servers:** The TLD servers are responsible for managing the domain names that share a common extension. They don't know the IP address either but can refer the resolver to the authoritative name servers for the specific domain.
5) **Authoritative Name Servers:** These servers store the DNS records for the domain, including the IP address. When the DNS resolver queries an authoritative name server, it receives the IP address for the domain.
6) **Response:** The resolver receives the IP address from the authoritative name servers and stores it in its cache for a specified time (to improve efficiency for future requests). It then sends the IP address back to your browser.
7) **Connection:** Your browser can now use the IP address to establish a connection to the web server hosting the website and request the webpage.
8) **Website Display:** The server sends the webpage data back to your browser, which processes and displays it.



**Example**


- You enter www.google.com into your browser.
- Your browser checks its cache; if the IP is not there, it asks the DNS resolver.
- The DNS resolver queries a root name server for the .com TLD.
- The root server directs to a .com TLD server.
- The TLD server points to Google's authoritative name servers.
- The authoritative server provides the IP address for www.google.com.
- The DNS resolver sends the IP address back to your browser.
- Your browser connects to Google's server using the IP address.
- Google's server sends the webpage data back to your browser.
- Your browser displays the Google search page.




  




