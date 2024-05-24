const Pairs = require('../schemas/pairsSchema');

async function deletePairs(ids) {
    try {
        if (!ids) return { status: 200, error: 'Pair IDs are required' };
        
        if (ids.length === 1) {
            const result = await Pairs.deleteOne({ _id: ids[0] });
            if(result.deletedCount === 0) return { status: 404, error: 'Pair not found' };

            return { status: 200, message: 'Pair deleted successfully' };
        }

        const result = await Pairs.deleteMany({ _id: { $in: ids } });
        if(result.deletedCount === 0) return { status: 404, error: 'No pairs found with the specified IDs' };

        return { status: 200, message: 'Pairs deleted successfully' };
    }
    catch(error) {
        console.error(`Error deleting pair: ${error}`);
        return { status: 500, error: 'Failed to delete paconst' };
    }
}

module.exports = deletePairs;