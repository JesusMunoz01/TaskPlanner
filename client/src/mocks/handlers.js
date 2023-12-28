import { http, HttpResponse } from 'msw'
import { json } from 'react-router-dom'
import { Response } from 'whatwg-fetch'

const mockDB = [{_id: 1, tasks: [{title: "mock1", description: "fake response 1", _id: 1},
          {title: "mock2", description: "fake response 2", _id: 2},
          {title: "mock3", description: "fake response 3", _id: 3}]
        },
                {_id: 2, tasks: [{title: "mock1", description: "fake response 1", _id: 1},
          {title: "mock2", description: "fake response 2", _id: 2},
          {title: "mock3", description: "fake response 3", _id: 3}]
        },
                {_id: 3, tasks: []
        }]

export const handlers = [
    http.get('http://localhost:5000/fetchTasks/:userID', (req, res, ctx) => {
        const userCheck = parseInt(req.params.userID)

        const index = mockDB.filter((user) => user._id === userCheck)
        console.log(index[0])
        console.log(index[0].tasks)
        if(index[0].user_id == 0)
          return res(ctx.status(400))
        else{
          return new Response(JSON.stringify({data: index[0]}), {headers: {'Content-Type': 'application/json',
          Data: index[0],}})
        }
    })
]