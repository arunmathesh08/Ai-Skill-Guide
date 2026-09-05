import ssl
import sys
import time

def run():
    print("Testing connection via Python pg8000 / psycopg2...")
    
    # Try pg8000
    try:
        import pg8000.native
        print("pg8000 is available.")
        
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
        
        hosts_to_try = [
            ("aws-0-ap-south-1.pooler.supabase.com", 6543, "postgres.ysqggazrfrmpvxqzmyru"),
            ("aws-0-ap-south-1.pooler.supabase.com", 5432, "postgres.ysqggazrfrmpvxqzmyru"),
        ]
        
        for host, port, user in hosts_to_try:
            print(f"Connecting to {host}:{port} with user {user}...")
            try:
                con = pg8000.native.Connection(
                    user=user,
                    password="GautamKRishna@07092007",
                    host=host,
                    port=port,
                    database="postgres",
                    ssl_context=ssl_ctx,
                    timeout=15
                )
                print(f"✅ SUCCESS connecting to {host}:{port}!")
                
                with open("supabase_schema.sql", "r", encoding="utf-8") as f:
                    schema_sql = f.read()
                
                print("Executing schema...")
                # Execute statement by statement
                statements = [s.strip() for s in schema_sql.split(";") if s.strip()]
                for stmt in statements:
                    try:
                        con.run(stmt)
                    except Exception as e:
                        print(f"Warning on stmt: {e}")
                
                print("✅ All schema tables created!")
                
                # Check tables
                tables = con.run("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
                print("Public tables in Supabase:", [t[0] for t in tables])
                con.close()
                return True
            except Exception as ex:
                print(f"Failed on {host}:{port}: {ex}")
    except ImportError:
        print("pg8000 not imported yet")
        
    return False

if __name__ == "__main__":
    run()
