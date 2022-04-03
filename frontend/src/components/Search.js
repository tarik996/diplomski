import { InputLabel, OutlinedInput, InputAdornment, IconButton, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const Search = (props) => {

    const requestSearch = (searchedVal) => {
        props.requestSearch(searchedVal);
    }

    return (
        <FormControl sx={{width: '100%'}} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-search">Pretraži...</InputLabel>
            <OutlinedInput
                id="outlined-adornment-search"
                endAdornment={
                    <InputAdornment position="end">
                      {props.search === "" ? (
                          <IconButton edge="end">
                              <SearchIcon/>
                          </IconButton>
                      ) : (
                          <IconButton edge="end" onClick={props.cancelSearch}>
                              <CloseIcon/>
                          </IconButton>
                      )}
                    </InputAdornment>
                }
                value={props.search}
                sx={{height: '50px'}}
                fullWidth={true}
                label="Pretraži..."
                onChange={(searchVal) => requestSearch(searchVal)}
            />
        </FormControl>
    );
}

export default Search;
