import subprocess

services = ["client", "comments", "query","moderation", "event-bus", "posts"]




def dockerize_services():
    for service in services:
        print(f"Dockerizing {service} service...")
        try:
            subprocess.run(["docker", "build", "-t", f"{service}-image", f"{service}/"])
        except subprocess.CalledProcessError as e:
            print(f"An error occurred while dockerizing {service}: {e}")
            continue




def run_services():
    for service in services:
        print(f"Running {service} service...")
        subprocess.run(["docker", "run", "-d", f"{service}-image"])




def stop_services():
    running_services = subprocess.run(["docker", "ps", "-q"], capture_output=True).stdout.decode("utf-8").strip().split("\n")
    for service_id in running_services:
        print(f"Stopping {service_id} service...")
        subprocess.run(["docker", "stop", service_id])




if __name__ == "__main__":
    # Dockerize and run all services
    dockerize_services()
    run_services()

    while True:
        stop = input("Do you want to stop the services? (y/n) ")
        if stop == "y":
            # Stop all running services
            stop_services()
            break
        elif stop == "n":
            break
        else:
            print("Invalid input. Please enter 'y' or 'n'.")




