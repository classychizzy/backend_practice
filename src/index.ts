import type { Request, Response } from 'express';
import express from 'express';
import bodyParser from 'body-parser'; 

let app = express();

const phones = [[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]];

//middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// get all phone entries

    app.get('/api/persons', (req: Request, res: Response) => {
      res.json(phones[0]);
    });
    // get info
    app.get('/api/persons/info', (req: Request, res: Response) => {
      res.send(`Phonebook has info for ${phones.length} people. 
        \n ${new Date(Date.now() + 2*60*60*1000).toUTCString()}+0200 
        (European standard time)`);
    });

    // get a single phone entry
    app.get('/api/persons/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    //access the first element of the phones array and find the person with the matching id
    const person = phones[0]?.find(person => person.id === id); 
    try {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send({ error: 'person not found' });
      }
    }
    catch (error) {
      if (person === undefined) {
        res.status(400).send({ error: 'malformatted id' });
      } else {
        res.status(500).send({ error: 'internal server error' });
      }
    }
    });
    
    //delete a single entry
    
    app.delete('/api/persons/:id', (req: Request, res: Response) => {
      const id = req.params.id;
      const personIndex = phones[0]?.findIndex(person => person.id === id);

      if (
        personIndex !== -1 &&
        personIndex !== undefined) {
     
        phones[0]?.splice(personIndex, 1);
        res.status(204).send({ message: `person with id ${personIndex}} deleted` });
      } else {
        res.status(404).send({ error: 'person not found' });
      }
    });

    //add a new phone entry
    app.post('/api/persons', (req: Request, res: Response) => {
      const { name, number } = req.body;
      try {
        if (!name || !number) {
          return res.status(400).json({ error: 'name or number is missing' });
        }
        const nameExists = phones[0]?.some(person => person.name === name);
        if (nameExists) {
          return res.status(400).json({ error: 'name must be unique' });
        }
        const newPerson = {
          id: (Math.floor(Math.random() * 10000)).toString(),
          name,
          number
        };
        phones[0]?.push(newPerson);
        res.status(201).json(newPerson);
      }
      catch (error) {
        res.status(500).json({ error: 'internal server error' });
      }
    });
    
//middleware to parse JSON bodies
app.use(express.json());



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});