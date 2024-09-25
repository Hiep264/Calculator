from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# FastAPI instance
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả origins trong môi trường phát triển
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Calculator(BaseModel):
    operation: str
    num1: float
    num2: float

@app.post("/calculate")
async def calculate(request: Calculator):
    result = 0
    if request.operation == "+":
        result = request.num1 + request.num2
    elif request.operation == "-":
        result = request.num1 - request.num2
    elif request.operation == "*":
        result = request.num1 * request.num2
    elif request.operation == "/":
        if request.num2 == 0:
            return {"error": "Division by zero is not allowed"}
        result = request.num1 / request.num2
    else:
        return {"error": "Invalid operation"}
    
    return {"result": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)